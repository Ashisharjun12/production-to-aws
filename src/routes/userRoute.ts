import express from 'express'
import { createUser, loginUser } from '../controllers/userController';

const userRoute = express.Router()



//routes
userRoute.post('/register' , createUser)
userRoute.post('/login' , loginUser)





export default userRoute;