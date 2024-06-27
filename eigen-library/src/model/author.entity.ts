import { DB, prismaErrHandler } from "@/libs/prisma";
import { Author } from "@/types/defs";

export const list = async (): Promise<object | undefined> => {
    try {
        return await DB.author.findMany();
    } catch (error: unknown) {
        prismaErrHandler(error);
    }
}
export const add = async (body: Author ): Promise<Author | undefined> => {
    try {
        return await DB.author.create({
            data: {...body}
        });
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}