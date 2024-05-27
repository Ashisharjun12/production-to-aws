import { NextFunction, Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import path from "path";
import fs from "fs";
import createHttpError, { HttpError } from "http-errors";
import bookmodel from "../models/bookmodel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre,author } = req.body;

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

    const newBook = await bookmodel.create({
      title,
      author: "6653f4e9e55b8788c4e81207",
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

export { createBook };
