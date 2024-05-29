import express from "express";
import { createPyq,  deletePyq,  listPyq,  singlePyq,  updatePyq } from "../controllers/pyqController";
import { singleBook } from "../controllers/bookController";
import upload from "../utils/multer";
import { auth } from "../middlewares/auth";

const pyqRoute = express.Router()


//routes

pyqRoute.post("/create" ,upload.fields([
    {
        name:"pyqfile" ,maxCount:1
    }

]),createPyq)
pyqRoute.get("/" , listPyq)
pyqRoute.get("/:pyqId" , singlePyq)
pyqRoute.patch('/:pyqId ' , updatePyq)
pyqRoute.delete("/:pyqId" , deletePyq)




export default pyqRoute