import express from 'express'
import { createBook, updateBook } from '../controllers/bookController';
import upload from '../utils/multer';
import { auth } from '../middlewares/auth';




const bookRoute = express.Router()



//routes
bookRoute.post('/create', auth, upload.fields([
    {name:'coverImage' , maxCount:1},
    {name:'file' , maxCount:1}
    

]),createBook)

//update book

bookRoute.patch('/:bookId', auth, upload.fields([
    {name:'coverImage' , maxCount:1},
    {name:'file' , maxCount:1}
    

]),updateBook)





export default bookRoute;