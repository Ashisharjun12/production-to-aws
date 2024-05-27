import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        requires:true
    }

}, {
    timestamps:true
})

const usermodel = mongoose.model('user' ,userSchema)

export default usermodel