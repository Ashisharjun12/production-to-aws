import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import usermodel from "../models/usermodel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required!!");

    return next(error);
  }


  //database call

  const user = await usermodel.findOne({email : email})

  if(user){
    const error = createHttpError(400 , "User Already Exist!!")
    next(error)
  }

  //process
  //response

  res.json({ msg: "user register success" });
};

export { createUser };
