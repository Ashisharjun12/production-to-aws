import { NextFunction, Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import path from "path";
import fs from "fs";
import createHttpError, { HttpError } from "http-errors";
import bookmodel from "../models/bookmodel";

export interface AuthRequest extends Request {
  userId: string;
}

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || files.coverImage.length === 0) {
      throw new Error("Cover image is required");
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      throw new Error("File does not exist at the specified path");
    }

    // Upload to Cloudinary
    const uploadData = await cloudinary.uploader.upload(filepath, {
      filename_override: filename,
      folder: "book-cover",
      format: coverImageMimeType,
    });

    console.log(uploadData);

    //bookfiles
    const bookFileName = files.file[0].filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-file-pdf",
      format: "pdf",
    });

    console.log(bookFileUpload);

    //create book

    const _req = req as AuthRequest;

    const newBook = await bookmodel.create({
      title,
      author: _req.userId,
      genre,
      file: bookFileUpload.secure_url,
      coverImage: uploadData.secure_url,
    });

    //delete temp files

    try {
      await fs.promises.unlink(filepath);

      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      return next(createHttpError(500, "error while create bookdata!!"));
    }

    res.status(201).json({ msg: "Book created", id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, "uploading while got error!!"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookmodel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(400, "book not found"));
  }

  const _req = req as AuthRequest;

  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthozized Error"));
  }

  //check img exist

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field is exists.
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatebookmoodel = await bookmodel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );
  res.json(updatebookmoodel);
};

const listbooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //add pagination in future

    const books = await bookmodel.find();

    return res.json({ msg: "all books listed", books });
  } catch (error) {
    return next(createHttpError(500, "error while getting books"));
  }
};

const singleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const getBook = await bookmodel.findById({ _id: bookId });

    return res.json({ msg: "getting single book", getBook });
  } catch (error) {
    return next(createHttpError(500, "error got while getting single book"));
  }
};

export { createBook, updateBook, listbooks, singleBook };
