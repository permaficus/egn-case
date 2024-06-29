import { addNewBook, deleteBook, fetchAllBooks } from '@/controller/book.controller';
import Router from 'express'
import { PathNotFound, errHandler } from '@/v1/middlewares/errHandler';
import { deleteMember, fetchAllMembers, newMembership } from '@/controller/member.controller';
import { fetchAllTransactions, newTransaction, returningBooks } from '@/controller/transact.controller';
import { deleteAuthor, fetchAllAuthors, newAuthor } from '@/controller/author.controller';
import { validateRequest } from '@/v1/middlewares/requestValidation';

export const router = Router();

router.get(`/books`, fetchAllBooks);
router.post(`/books`, validateRequest('Book'), addNewBook);

router.get(`/members`, fetchAllMembers);
router.post(`/members`, validateRequest('Member'), newMembership);


router.get(`/authors`, fetchAllAuthors);
router.post(`/authors`, validateRequest('Author'), newAuthor)

router.get(`/transactions`, fetchAllTransactions);
router.post(`/transaction`, validateRequest('Transaction'), newTransaction)

router.post(`/return-transactions`, returningBooks);

// for testing purpose
router.delete('/books', deleteBook);
router.delete('/members', deleteMember);
router.delete('/authors', deleteAuthor);

router.use(PathNotFound);
router.use(errHandler)