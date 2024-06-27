import { DB, prismaErrHandler } from "@/libs/prisma";
import { ReturnTransaction, Transaction } from "@/types/defs";

export const addTransaction = async (body: Transaction): Promise<Transaction | undefined> => {
    try {
        return await DB.$transaction(async (model) => {
            let bookList: any[] = []
            // first we need to update the stock
            body.details?.forEach(async items => {
                const status = await model.book.update({
                    where: {
                        code: items
                    },
                    data: {
                        stock: { decrement: 1 }
                    }
                })
                // if the stock return negative value
                // all transaction will be fail and throwing an error
                if (status.stock < 0) {
                    throw new Error(`Cannot borrow this book: ${items}`)
                } else {
                    bookList.push({
                        isbn: items
                    })
                }
            });
            // if the stock update succeeded, then store the transaction data
            let today = new Date();
            return await model.transaction.create({
                data: {
                    date: today,
                    memberCode: body.memberCode,
                    returnDate: new Date(today.setDate(today.getDate() + 7)),
                    status: 'Open',
                    details: {
                        create: bookList
                    }
                }
            })
        });
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
export const addReturnTransaction = async (body: ReturnTransaction): Promise<object | undefined> => {
    try {
        return await DB.$transaction(async (model) => {
            // get the transaction date base on ISBN
            const tdata: any = await model.transaction.findFirst({
                where: {
                    AND: [
                        { memberCode: body.memberCode },
                        { status: 'Open' }
                    ]
                },
                include: { details: { select: { isbn: true } } }
            });
            // create return transaction
            const returning = await model.returnTransaction.create({
                data: {
                    date: new Date(),
                    transId: tdata.id
                }
            });
            const currentDate = new Date();
            // If the book is returned after the time limit has been exceeded,
            // member will be penalized
            if (new Date(tdata.returnDate) < currentDate) {
                await model.member.update({
                    data: {
                        penalize: true
                    },
                    where: {
                        code: body.memberCode
                    }
                })
            }
            // update book quantity
            await model.book.updateMany({
                where: {
                    code: { in: tdata.details }
                },
                data: {
                    stock: { increment: 1 }
                }
            })
            // closed the transaction
            await model.transaction.update({
                where: {
                    id: tdata.id
                },
                data: {
                    status: 'Closed'
                }
            })
            return returning
        })
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}