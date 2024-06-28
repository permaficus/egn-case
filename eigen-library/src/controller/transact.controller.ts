import { Request, Response, NextFunction } from "express";
import { Transactions } from "@/model";

export const newTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Transactions.addTransaction({
            memberCode: req.body.member,
            books: req.body.books
        })
        res.status(201).json({
            status: 'OK',
            code: 201,
            details: response
        })
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}
export const returningBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Transactions.addReturnTransaction({
            memberCode: req.body.member
        })
        res.status(201).json({
            status: 'OK',
            code: 201,
            details: response
        })
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}