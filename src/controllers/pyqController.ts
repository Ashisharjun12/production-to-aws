import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import path from "path";
import fs from "fs";
import cloudinary from "../utils/cloudinary";
import pyqmodel from "../models/pyqmodel";

export interface AuthRequest extends Request {
  userId: string;
}

const createPyq = async (req: Request, res: Response, next: NextFunction) => {
  const { semester, branch, subject, year } = req.body;

  if (!semester || !branch || !subject || !year) {
    return next(createHttpError(400, "All fields required!"));
  }

  //pyqfile upload on cloudinary
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.pyqfile || files.pyqfile.length === 0) {
    throw new Error("pyqfile is required");
  }

  const pyqfileName = files.pyqfile[0].filename;

  const pyqFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    pyqfileName
  );

  //upload on cloudinary

  const pyqFileUpload = await cloudinary.uploader.upload(pyqFilePath, {
    resource_type: "raw",
    filename_override: pyqfileName,
    folder: "pyq-file-pdf",
    format: "pdf",
  });

  console.log(pyqFileUpload);

  //crete pyq on database

  const _req = req as AuthRequest;

  const newPyq = await pyqmodel.create({
    semester,
    branch,
    subject,
    year,
    pyqfile: pyqFileUpload.secure_url,
    uploadedby: _req.userId,
  });

  //delete temp files
  try {
    await fs.promises.unlink(pyqFilePath);
  } catch (error) {
    return next(createHttpError(500, "error while unlink pyq in cloudinary"));
  }

  res.json({ msg: "pyq created", _id: newPyq._id });
};

const listPyq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pyqs = await pyqmodel.find();

    res.json({ msg: "list pyqs", pyqs });
  } catch (error) {
    return next(createHttpError(500, "error while getting pyqs"));
  }
};

const singlePyq = async (req: Request, res: Response, next: NextFunction) => {
  const pyqId = req.params.pyqId;

  try {
    const getpyqs = await pyqmodel.findById({ _id: pyqId });

    if (!getpyqs) {
      return next(createHttpError(404, " pyq not found"));
    }

    res.json({ msg: "get single pyq", getpyqs });
  } catch (error) {
    return next(createHttpError(500, "something went wrong"));
  }
};

const updatePyq = async (req: Request, res: Response, next: NextFunction) => {
  const { semester, branch, subject, year } = req.body;
  const pyqId = req.params.pyqId;

  //check in db

  const pyq = await pyqmodel.findOne({ _id: pyqId });

  if (!pyq) {
    return next(createHttpError(400, "Pyq not found"));
  }

  //check authorization

  const _req = req as AuthRequest;

  if (pyq.uploadedby.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthozized Error"));
  }

  //check pyq file exist
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let completeFileName = "";
  if (files.pyqfile) {
    const pyqFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.pyqfile[0].filename
    );

    const pyqFileName = files.pyqfile[0].filename;
    completeFileName = pyqFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(pyqFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "pyq-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(pyqFilePath);
  }

  //update to db
  const pyqmodelUpdate = await pyqmodel.findOneAndUpdate(
    {
      _id: pyqId,
    },
    {
      semester,
      branch,
      subject,
      year,
      pyqfile: completeFileName ? completeFileName : pyq.pyqfile,
    },
    {
      new: true,
    }
  );
  return res.json({ msg: "pyq updated!!", pyqmodelUpdate });
};

const deletePyq = async (req: Request, res: Response, next: NextFunction) => {
  const pyqId = req.params.pyqId;

  const pyq = await pyqmodel.findOne({ _id: pyqId });

  //check pyq exist
  if (!pyq) {
    return next(createHttpError(400, "pyq not found"));
  }

  //check user auth the book
  const _req = req as AuthRequest;

  if (pyq.uploadedby.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthozized Error"));
  }

  //getting cloundinary book id to delete with folder

  const pyqfile = pyq.pyqfile.split("/");

  const pyqFilePublicId = pyqfile.at(-2) + "/" + pyqfile.at(-1);

  console.log("filepublieId", pyqFilePublicId);

  //destroy files from cloudinary

  try {
    await cloudinary.uploader.destroy(pyqFilePublicId, {
      resource_type: "raw", //only for pdf
    });
  } catch (error) {
    return next(
      createHttpError(500, "getting error while deleting data in cloudinary...")
    );
  }

  //delete from database

  await pyqmodel.deleteOne({ _id: pyqId });

  return res.status(204).json({ msg: "pyq deleted!!" });
};

export { createPyq, listPyq, updatePyq, singlePyq, deletePyq };
