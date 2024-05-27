import { NextFunction, Request, Response } from "express";

const createBook = ( req: Request, res: Response, next: NextFunction)=>{

    console.log('book data' , req.files)

    res.json({msg :"book "})


}


export {createBook}