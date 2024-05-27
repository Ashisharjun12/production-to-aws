import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import usermodel from "../models/usermodel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required!!");

    return next(error);
  }

  //process

  //database call

  try {
    const user = await usermodel.findOne({ email: email });

    if (user) {
      const error = createHttpError(400, "User Already Exist!!");
      next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "error while getting user"));
  }

  //hashpassword

  const hashpassword = await bcrypt.hash(password, 10);

  //store in db

  let newuser;

  try {
    newuser = await usermodel.create({
      name,
      email: email,
      password: hashpassword,
    });
  } catch (error) {
    return next(createHttpError(500, "error in user add in db"));
  }

  //token generatation

  try {
    const token = sign({ sub: newuser._id }, config.jwtsecret as string, {
      expiresIn: "7d",
    });

    
       //response
   res.json({ msg: "user register success", accessToken: token });
   
  } catch (error) {
    return next(
      createHttpError(500, "something went wrong in token generation")
    );
  }





};

export { createUser };
