const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv').config();
// const findOrCreate = require('mongoose-findorcreate')


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// mongoose.connect("mongodb+srv://admin-prat33k:admin123@cluster0.4wyjr.mongodb.net/campusQ-db");

// app.use(session({
//     Secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));


// app.use(passport.initialize());
// app.use(passport.session());



mongoose.connect("mongodb://Localhost:27017/CampusQ",{useNewUrlParser: true});




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

// passport.use(Post.createStrategy());
// passport.serializeUser(Post.serializeUser());
// passport.deserializeUser(Post.deserializeUser());

// passport.serializeUser(function(user, done) {
//     done(null, user.id); 
// });
// // used to deserialize the user
// passport.deserializeUser(function(id, done) {
//     Post.findById(id, function(err, user) {
//         done(err, user);
//     });
// });



// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/askque"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//     Post.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


app.post("/askque",async (req,res)=>{
    const data = req.body;
    console.log(data.question);
    const newPost = new Post({
        key: data._id,
        question: data.question,
        answers: ["In anim laborum minim dolore reprehenderi."],
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

let getPost = '';

app.post("/collab",(req,res)=>{
       getPost = req.body;
       console.log("Collab back-end")
       console.log(getPost);
});






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

app.get("/post",(req,res)=>{
    console.log("get request in /post with id => ")
    Post.find({'_id':{$in : mongoose.Types.ObjectId(getPost.id_details)}},(err,foundItem)=>{
        if(err){
            console.log("cant get data");
            console.log(err);
        }
        else{
            console.log("got data");
            console.log(foundItem);
            res.send(foundItem);  
        }
    })
})









// app.get("/home-posts", async (req, res)=>{

//     try {
//         const homePosts = await Post.find();
//         res.send(homePosts);
//     }
//     catch(err) {
//         console.error(err);
//     } 

// });


// app.get('/auth/google',function(req,res){
//   passport.authenticate('google', { scope: ["profile"] })});

// app.get('/auth/google/askque', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/askque');
//   });

// app.get("/askque",function(req,res){
//     if(req.isAuthenticated()){
//         res.render("askque");
//     }
//     else{
//         res.render("/");
//     }
// });





app.listen(process.env.PORT || 4000,function(req,res){
    console.log("Server is up and running on port 4000!!");
})