import { Request, Response, NextFunction } from "express";
import { Members } from "@/model";

export const fetchAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Members.list();
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
export const newMembership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await Members.add({
            ...req.body
        })
        res.status(201).json({
            status: 'OK',
            code: 200,
            details: response
        })
    } catch (error: any) {
        res.status(error.statusCode)
        next(error)
    }
}