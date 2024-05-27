import { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization Error"));
  }

  try {
    const parseToken = token.split(" ")[1];
    const decode = verify(parseToken, config.jwtsecret as string);
    const _req = req as AuthRequest;

    _req.userId = decode.sub as string;
  } catch (error) {
    return next(createHttpError(401, "token expired"));
  }

  next();
};

export { auth };
