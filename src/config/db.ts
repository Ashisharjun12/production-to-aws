import mongoose from "mongoose";
import { config } from "./config";

const connectdb = async () => {
  try {

    mongoose.connection.on("connected", () => {
        console.log("mongodb connected successfully!!");
      });
  
      mongoose.connection.on("error", (err) => {
        console.log("connection error in db ", err);
      });


    await mongoose.connect(config.mongourl); // for testing using locally db config.mongourl as string for testing purpose

   
  } catch (error) {
    console.log("mongodb connection errror : ", error);

    process.exit(1)
  }
};

export default connectdb;
