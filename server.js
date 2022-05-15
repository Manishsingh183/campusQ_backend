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
// const findOrCreate = require('mongoose-findorcreate');
// const { authenticate } = require('passport');


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// mongoose.connect("mongodb+srv://admin-prat33k:admin123@cluster0.4wyjr.mongodb.net/campusQ-db");

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));


// app.use(passport.initialize());
// app.use(passport.session());


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

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-'+  file.originalname )
//     }
// });
  
// var upload = multer({ storage}).single('file');

// app.post('/askque',(req,res)=>{
//     console.log(req.body);
//     upload(req,res,(err)=>{
//         if(err){
//             return res.status(500).json(err)
//         }
//         return res.status(200).send(req.file)
//     })
// });




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
        // img: {
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        //     contentType: 'image/png'
        // }
        
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

// app.get("/auth/google",(req,res)=>{
//     passport.authenticate("google",{scope:["profile"]});
//     console.log("Auth area");
// });

// app.get('/auth/google/askque', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     console.log("Auth comleted in auth/google/askque");
//     res.redirect('/askque');

//   });


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

// 
// const url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token;
// app.get(url,(req,res)=>{
//     console.log(req);
// })


// let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2MTY0OWU0NTAzMTUzODNmNmI5ZDUxMGI3Y2Q0ZTkyMjZjM2NkODgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjcxNDMxODQ0MjE1LXNpMjd2NXNoMnE0Z3Q3dGE2anAzaWVncGRycmVxbTBlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjcxNDMxODQ0MjE1LXNpMjd2NXNoMnE0Z3Q3dGE2anAzaWVncGRycmVxbTBlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEwNjQzMDI5MDQ4OTMzNTEwNzMyIiwiZW1haWwiOiJtYW5pc2hzaW5naDkwNTE2MTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJMRmJ3X2JKdmY2WGNaR3hHaXp2QXZBIiwibmFtZSI6IkRlY2F0aCBsb2dvbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp3WjY5QnFjZVVlTWMxU25LS0p3MXhiZlg4SUdvMTJtVlY1YnBtUD1zOTYtYyIsImdpdmVuX25hbWUiOiJEZWNhdGgiLCJmYW1pbHlfbmFtZSI6ImxvZ29uIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTE0MzE0ODEsImV4cCI6MTY1MTQzNTA4MSwianRpIjoiZTYzNGQxNGM1ZTdiMzM5MTVjZDc1MzZhNTc0Yzk3ZmU5MDdmMWFiYyJ9.CjPlon_PCANWBsywveYdHSeDTYUyS1IsIuqVCNcm6jNC_QWgQaUvOAwaYGVH-OhUdX5rRI_oJfHQYJjECiREwWeGrjuj-BfcB6XsDJfAq-sRIy2eQEvh4hu7UkFKbZyDdAX895SF1Hv81EXCdu71A5CT0AZu9ep1GFaYkRmDOqCBTL9Ytgm9ioOmxBd1u7gbFJU0LfMcpbY0sQiyRfJi-JKLkwvF_DsOAGUoiy1L0Fd3IDbYlQZ9jAYXQqClcO4eVwaqgSDCLVcpe4TRWnTMyRlrdSpxtGr84E-qtJi8pUuFy_gLVy5k_zH4X6nUekHL-KvS90yFwSkMo2QpLpqfrQ"

// app.get("/askque",(req,res)=>{
//     if(req.isAuthenticated()){
//         console.log("Authentication completed");
//         res.render('askque');
//     }else{
//         res.redirect('/login');
//     }
// });









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
