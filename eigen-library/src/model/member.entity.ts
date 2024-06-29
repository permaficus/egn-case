import { DB, prismaErrHandler } from "@/libs/prisma";
import { Member } from "@/types/defs";

export const list = async (): Promise<Member[] | any[] | undefined> => {
    try {
        return await DB.member.findMany();
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