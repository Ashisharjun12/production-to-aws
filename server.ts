import app from "./src/app";
import { config } from "./src/config/config";
import connectdb from "./src/config/db";
import { Request , Response } from "express";

const serverStart = async()=>{

    const port = config.port || 8000

    //connect to database 
    await connectdb()

    app.get('/', (req:Request,res:Response)=>{
        res.send("server is working")
    })


    //health check
    app.get('/health' , (req:Request,res:Response)=>{
        res.json({msg:"everything is healthy!!"})
    })



    app.listen(port , ()=>{
        console.log(`server is running at ${port}`)
    })
}


serverStart()