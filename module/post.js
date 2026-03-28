import mongoose from "mongoose";

const postschema = mongoose.Schema({
    user:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    title:{type:String,maxlength:15,minlength:1},
    content:{type:String,minlength:1,maxlength:700},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
})

export const posts = mongoose.model("post",postschema)