import express from 'express'
const app = express()


app.get('/' , (req,res)=>{
    res.json({meg: "server is running..."})
})


export default app;