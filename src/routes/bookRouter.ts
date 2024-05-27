import express from 'express'
import { createBook } from '../controllers/bookController';


const bookRoute = express.Router()



//routes
bookRoute.post('/create' , createBook)





export default bookRoute;