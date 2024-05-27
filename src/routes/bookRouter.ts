import express from "express";
import {
  createBook,
  deleteBook,
  listbooks,
  singleBook,
  updateBook,
} from "../controllers/bookController";
import upload from "../utils/multer";
import { auth } from "../middlewares/auth";

const bookRoute = express.Router();

//routes
bookRoute.post(
  "/create",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

//update book

bookRoute.patch(
  "/:bookId",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

//get all books

bookRoute.get("/", listbooks);

//getting single book

bookRoute.get('/:bookId' , singleBook)

//delete book

bookRoute.delete('/:bookId', auth, deleteBook)

export default bookRoute;
