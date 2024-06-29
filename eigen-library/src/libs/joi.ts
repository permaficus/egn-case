import Joi, { ValidationError } from 'joi';
import { PayloadSelector } from '@/types/defs';

const validator = async (schema: any, payload: any) => {
    return await schema.validateAsync(payload, {
        abortEarly: true,
        allowUnknown: false
    })
};

const authorTemplate: any = {
    name: Joi.string().label('Author Name').required()
}

const bookTemplate: any = { 
    code: Joi.string().label('Book ISBN').required(),
    title: Joi.string().label('Books Title').required(),
    stock: Joi.number().min(1).label('Books Quantity').required(),
    author: Joi.string().label('Books Author').required()
}
const memberTemplate: any = {
    code: Joi.string().label('Members ID').required(),
    name: Joi.string().label('Members Name').required()
}
const transactionTemplate: any = {
    member: Joi.string().label('Members ID').required(),
    books: Joi.array().min(1).max(2).label('The book to be borrowed').required()
}

const validateSchema = async (payload: any, selector: PayloadSelector) => {
    const _joi = {
        ...selector == 'Author' ? { template: authorTemplate } : {},
        ...selector == 'Book' ? { template: bookTemplate } : {},
        ...selector == 'Member' ? { template: memberTemplate } : {},
        ...selector == 'Transaction' ? { template: transactionTemplate } : {}
    }
    let schema = Joi.object(_joi.template)
    return await validator(schema, payload)
}

export { validateSchema, ValidationError }