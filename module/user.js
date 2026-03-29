import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(()=> console.log("Connected"))
    .catch((err)=> console.log(err))

const userschema = mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    post:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}]
})

export const user = mongoose.model("user",userschema)