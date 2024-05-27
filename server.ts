import app from "./src/app";
import { config } from "./src/config/config";

const serverStart = ()=>{

    const port = config.port || 8000

    app.listen(port , ()=>{
        console.log(`server is running at ${port}`)
    })
}


serverStart()