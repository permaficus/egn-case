import { addNewBook, fetchAllBooks } from '@/controller/book.controller';
import Router from 'express'
import { PathNotFound, errHandler } from '@/v1/middlewares/errHandler';
import { fetchAllMembers, newMembership } from '@/controller/member.controller';
import { fetchAllTransactions, newTransaction, returningBooks } from '@/controller/transact.controller';
import { fetchAllAuthors, newAuthor } from '@/controller/author.controller';
import { validateRequest } from '@/v1/middlewares/requestValidation';

export const router = Router();

router.get(`/books`, fetchAllBooks);
router.post(`/books`, addNewBook)

router.get(`/members`, fetchAllMembers);
router.post(`/members`, newMembership)

router.get(`/authors`, fetchAllAuthors);
router.post(`/authors`, newAuthor)

router.get(`/transactions`, fetchAllTransactions);
router.post(`/transaction`, validateRequest('Transaction'), newTransaction)

router.post(`/return-transactions`, returningBooks)

router.use(PathNotFound);
router.use(errHandler)