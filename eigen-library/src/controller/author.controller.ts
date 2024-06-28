import { Authors } from "@/model";
import { Author } from "@/types/defs";
import { Request, Response, NextFunction } from "express";

export const fetchAllAuthors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Authors.list();
        res.status(200).json({
            status: 'OK',
            code: 200,
            data: response
        })
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}
export const newAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Authors.add({
            name: req.body.name
        })
        res.status(201).json({
            status: 'OK',
            code: 201,
            data: {
                author: response
            }
        })
    } catch (error: any) {
        res.status(error.statusCode);
        next(error)
    }
}