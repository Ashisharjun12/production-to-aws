import express from 'express'
import { createUser } from '../controllers/userController';

const userRoute = express.Router()



//routes
userRoute.post('/register' , createUser)





export default userRoute;