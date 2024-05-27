import express from "express";
import errorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  res.json({ meg: "server is running..." });
});

//error handel
app.use(errorHandler)

export default app;
