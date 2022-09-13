const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv').config();
const multer = require('multer');
var fs = require('fs');
var path = require('path');


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));



mongoose.connect("mongodb+srv://mansih:Cfo0lyPvoxJN8hFM@cluster0.k6145.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true})
.then(()=>{
    console.log("Database Connected");
}).catch(err=>{
    console.log("Database not Connected!!!");
});





let date = new Date().toLocaleDateString("en-IN", {
    year: 'numeric',
    month: 'long',
    day: "numeric"
});

let time = new Date().toLocaleTimeString('en-US', {
    hour12: false, 
    hour: "numeric", 
    minute: "numeric"
});

const postSchema = new mongoose.Schema({
    key: Number,
    question: String,
    answers: [String],      // ith answer
    likes: [Number],        // like of ith answer
    dislikes: [Number],     // dislike of ith answer
    comments: [[String]],   // array of comments on ith answer 
    date: String,
    time: String,
});


const projSchema = new mongoose.Schema({
    key: Number,
    projName: String,
    descr: String,
    collab: Number,
    skills: String,
});

// postSchema.plugin(findOrCreate);

const Post = new mongoose.model("Post", postSchema);
const Project = new mongoose.model("Project",projSchema);





app.post("/askque",async(req,res)=>{
    const data = req.body;
    console.log(req.body);
    const newPost = new Post({
        key: data._id,
        question: data.question,
        answers: ["In anim laborum minim dolore reprehenderi.","aksljnbkdjvbv","sadkjbvnfkjlbndsf"],
        likes: 5,
        dislikes: 1,
        comments: [],
        date: date,
        time: time,
        
    });
    Post.create(newPost,(err)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    })
});

app.post("/add_proj",async (req,res)=>{
    const data = req.body;
    // console.log(data);
    const newProject = new Project({
        key: data._id,
        projName: data.projName,
        descr: data.descr,
        collab: data.collab,
        skills: data.skills,
    });
    Project.create(newProject,(err)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    })
});

app.post("/newans",async (req,res)=>{
    const data = req.body;
    console.log(data);
    Post.findOneAndUpdate(
        { _id: data.id }, 
        { $push: { answers: data.ans } },
        function (err, success) {
            if (err) {
                console.log(err);
            } else {
                console.log("done");
            }
        }
    );
})




app.post('/posts',(req,res)=>{
    // console.log(req.body);
})






app.get("/",function(req,res){
    Post.find({},function(err,foundItems){
        if(err){
            console.log(err);
        }
        else{
            res.send(foundItems);  
        }
    })
});




app.get("/collab", (req,res) => {
    Project.find({},(err,foundItem) => {
        if(err){
            console.log(err);
        }
        else{
            res.send(foundItem);  
        }
    })
})

app.get("/posts/:Id",(req,res)=>{
    const postId = req.params.Id;
    // console.log("get request in /post/ with id => ",postId);
    Post.findById(postId,(err,foundItem)=>{
        if(err){
            console.log("cant get data");
            console.log(err);
        }
        else{
            console.log("got data");
            res.send(foundItem);  
        }
    }).clone().catch(function(err){ console.log(err)})
});




app.listen(process.env.PORT || 4000,function(req,res){
    console.log("Server is up and running on port 4000!!");
})
