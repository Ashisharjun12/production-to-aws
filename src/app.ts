import express from "express";
import errorHandler from "./middlewares/globalErrorHandler";
import userRoute from "./routes/userRoute";


const app = express();

//important middlewares
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ meg: "server is running..." });
});

//router middleware
app.use( '/api/users',userRoute)


//error handel
app.use(errorHandler)

export default app;
