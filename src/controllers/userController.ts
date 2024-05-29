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
 return res.json({msg:"user Register successfully!!" ,_id : newuser._id})
 
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All Fields Required!!");

    return next(error);
  }

  //dbcall
let user;
  try {
     user = await usermodel.findOne({ email });

    if (!user) {
      return next(createHttpError(400, "User not found"));
    }
  } catch (error) {
    return next(createHttpError(500, "internal server error"));
  }

  //match passsword

  try {
    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return next(createHttpError(400, "email and password is incorrect!!"));
    }
  } catch (error) {
    return next(createHttpError(500, "something went  wrong"));
  }

  //create access token

  try {
    const token = sign({ sub: user._id }, config.jwtsecret as string, {
      expiresIn: "7d",
    });

    //response

    res.json({ msg: "ok", accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "something went wrong"));
  }
};

export { createUser, loginUser };
