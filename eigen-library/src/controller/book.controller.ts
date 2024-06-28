import { Books } from "@/model";
import { Request, Response, NextFunction } from "express";

export const fetchAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Books.list();
        res.status(200).json({
            status: 'OK',
            code: 200,
            data: response
        }).end();
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}
export const addNewBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Books.add({
            ...req.body
        })
        res?.status(201).json({
            status: 'OK',
            code: 201,
            data: response
        })
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}