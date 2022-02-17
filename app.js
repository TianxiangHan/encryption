//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// var _ = require('lodash');
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/loginDB");


const userSchema=new mongoose.Schema({
  email:String, 
  password: String
});
  userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User= new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser=new User({
    email:req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  User.findOne({email:req.body.username},function(err,found){
    if(!err){
      if(found&&found.password===req.body.password){
          res.render("secrets");
      }
      else{
        res.send("the email dose not exist or password is wrong");
      }
    }
    else{
      console.log(err);
    }
  });
});

let port = 3000;
app.listen(port,function(){
if(port===3000){
  console.log("local server is up");
}
else{
  console.log("heroku server is up");
}

});
