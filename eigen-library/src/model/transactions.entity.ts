// Import necessary modules and functions from prisma and local types
import { DB, prismaErrHandler } from "@/libs/prisma";
import { ReturnTransaction, Transaction } from "@/types/defs";

// Define an async function to add a transaction
export const addTransaction = async (body: Transaction): Promise<any> => {
    // Initialize an empty array to hold book details
    let booksDetails: any[] = [];
    
    // Add each book's ISBN to the booksDetails array
    body.books?.forEach(items => {
        booksDetails.push({ isbn: items });
    });

    try {
        // Start a transaction in the database
        return await DB.$transaction(async model => {
            // Find the member and check if they are penalized
            const { penalize, until }: any = await model.member.findFirst({
                where: {
                    code: body.memberCode
                },
                select: {
                    penalize: true,
                    until: true
                }
            });

            // If the member is penalized, throw an error
            if (penalize) {
                throw new Error(`This member cannot borrow any books until: ${new Date(until)}#Code: 401`);
            }

            // Update the stock of books to decrement by 1
            await model.book.updateMany({
                where: {
                    code: { in: body.books }
                },
                data: {
                    stock: { decrement: 1 }
                }
            });

            // Check the stock status of the books
            const bookStatus = await model.book.findMany({
                where: { code: { in: body.books } },
                select: { code: true, stock: true }
            });

            // Collect books that have negative stock
            let negativeStock: any[] = [];
            bookStatus.filter((items) => items.stock < 0).forEach(items => negativeStock.push(items.code));

            // If there are books with negative stock, throw an error
            if (negativeStock.length !== 0) {
                throw new Error(`Cannot continue this transaction. Book: ${negativeStock} is not available#Code: 400`);
            }

            // Create the transaction
            let today = new Date();
            const t = await model.transaction.create({
                data: {
                    date: new Date(),
                    returnDate: new Date(today.setDate(today.getDate() + 7)),
                    status: 'Open',
                    memberCode: body.memberCode,
                    books: {
                        create: booksDetails
                    }
                },
                include: {
                    books: {
                        select: {
                            bookIsbn: {
                                select: {
                                    code: true,
                                    title: true
                                }
                            }
                        }
                    }
                }
            });

            // Extract the books and format the result
            let { books, ...result } = t;
            Object.assign(result, { books: [] });
            t.books.forEach(items => {
                // @ts-ignore
                result.books.push(items.bookIsbn);
            });

            return result;
        });
    } catch (error: any) {
        // Handle any errors that occur during the transaction
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
                include: { books: { select: { isbn: true } } } // Include the book details
            });
            if (!tdata) {
                throw new Error(`There is no transaction from this member: ${body.memberCode}#Code: 404`)
            }
            // Create a new return transaction record
            const rt = await model.returnTransaction.create({
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
                        penalize: true, // Set the penalize flag to true
                        until: new Date(currentDate.setDate(currentDate.getDate() + 3))
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
            Object.assign(rt, { member: tdata.memberCode, books: tdata.books });
            return rt;
        });
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
