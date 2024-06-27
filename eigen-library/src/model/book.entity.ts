import { DB, prismaErrHandler } from "@/libs/prisma";
import { Book } from "@/types/defs";

export const list = async (): Promise<object | undefined> => {
    try {
        return await DB.book.findMany({
            where: {
                stock: { not: 0 }
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
export const add = async (body: Book): Promise<Book | undefined> => {
    try {
        return await DB.book.create({
            data: { ...body}
        })
    } catch (error) {
        
    }
}