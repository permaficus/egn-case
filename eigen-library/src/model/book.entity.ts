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
        return await DB.$transaction(async model => {
            const exist = await model.author.findFirst({
                where: {
                    name: { equals: body.author }
                }
            })
            let createQuery = exist ? {
                code: body.code,
                stock: body.stock,
                title: body.title,
                authorId: exist.id
             } : {
                code: body.code,
                stock: body.stock,
                title: body.title,
                author: {
                    create: {
                        name: body.author
                    }
                }
             }
             const res = await model.book.create({
                data: createQuery,
                include: { author: true }
             })
             return {
                 id: res.id,
                 code: res.code,
                 title: res.title,
                 stock: res.stock,
                 author: res.author.name
             }
        })
    } catch (error) {
        prismaErrHandler(error);
    }
}