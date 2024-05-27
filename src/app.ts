import express from "express";
import cors from 'cors';
import errorHandler from "./middlewares/globalErrorHandler";
import userRoute from "./routes/userRoute";
import bookRoute from "./routes/bookRouter";
import { config } from "./config/config";


const app = express();

//important middlewares
app.use(cors(
  {
    origin:config.domain
  }
))
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ meg: "server is running..." });
});

//router middleware
app.use( '/api/users',userRoute)
app.use('/api/books' , bookRoute)


//error handel
app.use(errorHandler)

export default app;
