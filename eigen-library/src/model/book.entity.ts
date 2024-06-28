import { DB, prismaErrHandler } from "@/libs/prisma";
import { Book } from "@/types/defs";

export const list = async (): Promise<object | undefined> => {
    try {
        return await DB.book.findMany({
            where: {
                stock: { not: 0 }
            },
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            },
            omit: {
                authorId: true
            }
        });
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
export const add = async (body: Book): Promise<Book | undefined> => {
    try {
        const res = await DB.book.create({
            data: {
                code: body.code,
                stock: body.stock,
                title: body.title,
                author: {
                    create: {
                        name: body.author
                    }
                }
            },
            include: {
                author: true
            }
        });
        return {
            id: res.id,
            code: res.code,
            title: res.title,
            stock: res.stock,
            author: res.author.name
        }
    } catch (error) {
        prismaErrHandler(error);
    }
}