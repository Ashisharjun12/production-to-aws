import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    title: {
        type : String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    genere:{
        type:String,
        required:true
    }



}, {
    timestamps:true
})


const bookmodel = mongoose.model('book' , bookSchema)

export default bookmodel;