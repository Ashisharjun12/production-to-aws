import express from 'express'
import { createBook } from '../controllers/bookController';
import upload from '../utils/multer';
import { auth } from '../middlewares/auth';




const bookRoute = express.Router()



//routes
bookRoute.post('/create', auth, upload.fields([
    {name:'coverImage' , maxCount:1},
    {name:'file' , maxCount:1}
    

]),createBook)





export default bookRoute;