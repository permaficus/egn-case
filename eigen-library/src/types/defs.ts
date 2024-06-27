export interface Author {
    id: string
    name: string
}
export interface Book {
    id?: string
    code: string
    title: string
    stock: number
    authorId: string
}
export interface Member {
    id?: string
    code: string
    name: string
    penalized?: boolean
}
export interface Transaction {
    id?: string
    date: Date
    returnDate: Date
    memberCode: string
    details?: any[]
}
export interface Details {
    id?: string
    transId: string
    isbn: string
}
export interface ReturnTransaction {
    memberCode: string
}