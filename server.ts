import app from "./src/app";

const serverStart = ()=>{

    const port = process.env.PORT || 8000

    app.listen(port , ()=>{
        console.log(`server is running at ${port}`)
    })
}


serverStart()