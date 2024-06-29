import { DB, prismaErrHandler } from "@/libs/prisma";
import { Member, FilterTransaction } from "@/types/defs";

const filterObject = (args: any[]): string[] => {
    const t: FilterTransaction[] = args;
    const titles: string[] = t.reduce<string[]>((acc, transaction) => {
        const bookTitles = transaction.books.map(book => book.bookIsbn.title);
        return acc.concat(bookTitles)
    }, []);
    return titles
}

export const list = async (): Promise<Member[] | any[] | undefined> => {
    try {
        const result = await DB.member.findMany({
            include: {
                transactions: {
                    where: {
                        status: 'Open'
                    },
                    omit: {
                        id: true,
                        date: true,
                        memberCode: true,
                        returnDate: true,
                        status: true
                    },
                    include: {
                        books: {
                            omit: {
                                id: true,
                                transId: true
                            },
                            include: {
                                bookIsbn: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        let newResult: any[] = [];
        result.map(items => {
            let books;
            if (items.transactions.length !== 0 ) {
                const titles = filterObject(items.transactions) || '0';
                books = {
                    total: titles.length,
                    titles
                }
            }
            newResult.push({
                id: items.id,
                code: items.code,
                name: items.name,
                penalized: items.penalized,
                until: items.until || 'n/a',
                books
            })
        })
        return newResult

    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const add = async (body: Member): Promise<Member | any> => {
    try {
        return await DB.member.create({
            data: {
                ...body
            },
            omit: {
                penalized: true,
                until: true
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const destroy = async (code: string | undefined): Promise<object | undefined> => {
    try {
        return await DB.member.delete({
            where: { code: code }
        })
    } catch (error: any) {
        prismaErrHandler(error)
    }
}