import { Request, Response, NextFunction } from 'express';

export interface HttpIncoming {
    req?: Request
    res?: Response
    next?: NextFunction
}
export interface Author {
    id?: string
    name: string
}
export interface Book {
    id?: string
    code: string
    title: string
    stock: number
    author: string
}
export interface Member {
    id?: string
    code: string
    name: string
    penalized?: boolean
    until?: Date
    borrowing?: any[]
}
export interface Transaction {
    id?: string
    date?: Date
    returnDate?: Date
    memberCode: string
    books?: any[]
}
export interface Details {
    id?: string
    transId: string
    isbn: string
}
export interface ReturnTransaction {
    memberCode: string
}
export interface QueryInput {
    status?: string
    id?: string
}
type FilterBook = {
    isbn: string,
    bookIsbn: {
        title: string;
    }
}
export type FilterTransaction = {
    books: FilterBook[];
}
export type PayloadSelector = 'Author' | 'Book' | 'Member' | 'Transaction'