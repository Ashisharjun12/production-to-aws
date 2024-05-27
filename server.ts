import app from "./src/app";
import { config } from "./src/config/config";
import connectdb from "./src/config/db";

const serverStart = async()=>{

    const port = config.port || 8000

    //connect to database 
    await connectdb()

    app.listen(port , ()=>{
        console.log(`server is running at ${port}`)
    })
}


serverStart()