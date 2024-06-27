// Import necessary modules and functions from prisma and local types
import { DB, prismaErrHandler } from "@/libs/prisma";
import { ReturnTransaction, Transaction } from "@/types/defs";

// Define an async function to add a transaction
export const addTransaction = async (body: Transaction): Promise<Transaction | undefined> => {
    try {
        // Start a transaction in the database
        return await DB.$transaction(async (model) => {
            let bookList: any[] = [];
            // Update the stock for each item in the transaction details
            body.details?.forEach(async items => {
                const status = await model.book.update({
                    where: {
                        code: items // Identify the book by its code
                    },
                    data: {
                        stock: { decrement: 1 } // Decrease the stock by 1
                    }
                });
                // If stock becomes negative, throw an error to abort the transaction
                if (status.stock < 0) {
                    throw new Error(`Cannot borrow this book: ${items}`);
                } else {
                    // If stock update is successful, add the book to the book list
                    bookList.push({
                        isbn: items
                    });
                }
            });
            // If stock updates succeeded, create a new transaction record
            let today = new Date();
            return await model.transaction.create({
                data: {
                    date: today, // Set the transaction date to today
                    memberCode: body.memberCode, // Set the member code
                    returnDate: new Date(today.setDate(today.getDate() + 7)), // Set the return date to one week from today
                    status: 'Open', // Set the status to 'Open'
                    details: {
                        create: bookList // Add the book list to the transaction details
                    }
                }
            });
        });
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}

// Define an async function to add a return transaction
export const addReturnTransaction = async (body: ReturnTransaction): Promise<object | undefined> => {
    try {
        // Start a transaction in the database
        return await DB.$transaction(async (model) => {
            // Find the transaction data based on the member code and status
            const tdata: any = await model.transaction.findFirst({
                where: {
                    AND: [
                        { memberCode: body.memberCode },
                        { status: 'Open' }
                    ]
                },
                include: { details: { select: { isbn: true } } } // Include the transaction details
            });
            // Create a new return transaction record
            const returning = await model.returnTransaction.create({
                data: {
                    date: new Date(), // Set the return date to today
                    transId: tdata.id // Set the transaction ID
                }
            });
            const currentDate = new Date();
            // If the book is returned late, penalize the member
            if (new Date(tdata.returnDate) < currentDate) {
                await model.member.update({
                    data: {
                        penalize: true // Set the penalize flag to true
                    },
                    where: {
                        code: body.memberCode // Identify the member by their code
                    }
                });
            }
            // Update the stock for all books in the transaction
            await model.book.updateMany({
                where: {
                    code: { in: tdata.details }
                },
                data: {
                    stock: { increment: 1 } // Increase the stock by 1
                }
            });
            // Close the original transaction by updating its status
            await model.transaction.update({
                where: {
                    id: tdata.id // Identify the transaction by its ID
                },
                data: {
                    status: 'Closed' // Set the status to 'Closed'
                }
            });
            return returning; // Return the return transaction record
        });
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
