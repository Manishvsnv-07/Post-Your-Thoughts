import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/userdatabase")

const userschema = mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    post:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}]
})

export const user = mongoose.model("user",userschema)