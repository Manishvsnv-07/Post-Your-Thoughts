import express from "express"
import bcrypt from "bcrypt"
import { user } from "./module/user.js"
import {posts} from "./module/post.js"
import jwt from "jsonwebtoken"
import parser from "cookie-parser"
const app = express()
const port = 57911
app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(parser())
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => {
    res.render("index");
})
app.get("/profile",islogged,async(req,res)=>{
    let userdata = await user.findOne({username:req.datahere.username}).populate("post")
    res.render("profile",{userdata})
})
app.post("/create",async(req, res) => {
    const { name, username, password } = req.body;
    let uname = await user.findOne({ username: req.body.username })
    if (uname) {
        return res.send("User Already Exists")
    }
    let hash = await bcrypt.hash(req.body.password, 10)
    const createuser = new user({
        name,
        username,
        password: hash
    })
    let token = jwt.sign({ username: createuser.username}, "secretcode")
    res.cookie("token", token);
    await createuser.save();
    res.redirect("/profile") 
})
app.post("/login", async(req, res) => {
    const { username, password } = req.body;
    let checkusername = await user.findOne({ username: req.body.username })
    let verifypassword = await bcrypt.compare(req.body.password, checkusername.password)
    if (verifypassword) {
        let token = jwt.sign({ username: checkusername.username, password: checkusername.password }, "secretcode")
        res.cookie("token", token);
        res.redirect("/profile")
    }
    else {
        res.send("something went wrong")
    }
})
app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/")
})
app.post("/post",islogged,async (req,res)=>{
    const{title,content} = req.body;
    try{
        let userdata = await user.findOne({username:req.datahere.username})
        const newpost = new posts({
            user:userdata._id,
            title,
            content,
        })
        await newpost.save()
        userdata.post.push(newpost._id)
        await userdata.save()
        res.redirect("/profile")
    }
    catch(err) {
        if(err.name == "ValidationError"){
                let userdata = await user.findOne({username:req.datahere.username}).populate("post")
            res.render("profile",{error : "Must be within character limit !",userdata})
        }
    }
})

app.get("/delete/:id",islogged,async(req,res)=>{
    let findid = await posts.findByIdAndDelete(req.params.id) 
    res.redirect("/profile")  
})
app.get("/like/:id",islogged,async(req,res)=>{
    let finduser = await user.findOne({username:req.datahere.username})
    let findid = await posts.findOne({_id:req.params.id})

    if(findid.likes.indexOf(finduser._id) === -1){
        findid.likes.push(finduser._id)
    }
    else{
        findid.likes.splice(findid.likes.indexOf(finduser._id),1)
    }
    await findid.save()
    res.redirect("/profile")
})
app.listen(port, () => {
    console.log(`My Port At ${port}`);
})
function islogged(req,res,next){
    if(req.cookies.token === ""){
        res.redirect("/");
    }
    else{
        let verify = jwt.verify(req.cookies.token,"secretcode")
        req.datahere = verify;
        next()
    }
}