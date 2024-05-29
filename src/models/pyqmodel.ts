import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },
    pyqfile: {
      type: String,
      required: true,
    },
    uploadedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
     
    },
  },
  {
    timestamps: true,
  }
);

const pyqmodel = mongoose.model("pyq", pyqSchema);

export default pyqmodel;
