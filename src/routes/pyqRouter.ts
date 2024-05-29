import express from "express";
import {
  createPyq,
  deletePyq,
  listPyq,
  singlePyq,
  updatePyq,
} from "../controllers/pyqController";
import upload from "../utils/multer";
import { auth } from "../middlewares/auth";

const pyqRoute = express.Router();

//routes

pyqRoute.post(
  "/create",
  auth,
  upload.fields([
    {
      name: "pyqfile",
      maxCount: 1,
    },
  ]),
  createPyq
);
pyqRoute.get("/", listPyq);
pyqRoute.get("/:pyqId", singlePyq);
pyqRoute.patch(
  "/:pyqId",
  auth,
  upload.fields([
    {
      name: "pyqfile",
      maxCount: 1,
    },
  ]),
  updatePyq
);
pyqRoute.delete("/:pyqId", auth,deletePyq);

//change

export default pyqRoute;
