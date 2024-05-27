import { NextFunction, Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import path from "path";
import fs from "fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || files.coverImage.length === 0) {
      throw new Error("Cover image is required");
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(__dirname, '../../public/data/uploads', filename);

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

    res.json({ msg: "Book created", uploadData });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    next(error);
  }
};

export { createBook };
