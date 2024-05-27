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

  const user = await usermodel.findOne({ email: email });

  if (user) {
    const error = createHttpError(400, "User Already Exist!!");
    next(error);
  }

  //hashpassword

  const hashpassword = await bcrypt.hash(password, 10);

  //store in db
  const newuser = await usermodel.create({
    name,
    email : email,
    password: hashpassword,
  });

  //token generatation
  const token = sign({ sub: newuser._id }, config.jwtsecret as string, {
    expiresIn: "7d",
  });

  //response

  res.json({ msg: "user register success", accessToken: token });
};

export { createUser };
