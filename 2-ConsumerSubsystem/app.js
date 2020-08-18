// INCLUDE
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const Call = require("./Models/models");
const connectToDB=require("./database/Connection")

connectToDB.connectToMongo();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MACRO
const PORT = process.env.PORT || 5000;

// GLOBAL

// set rendering to be with ejs
app.set("view engine", "ejs");

// to enablue use of static files like css files
app.use(express.static("public"));

// ROUTING
app.get("/",function (req,res) {
    res.send("Consumer 1 Home Page");
  });

// add new document in the 'FinalProjectDB' in 'data' collection
const call = new Call({id:'2',city:'Tel Aviv'}); 
call.save().then(()=>{console.log("call added");})

// server is listening on port 3000
server.listen(PORT , function () {
    console.log("Server is running on port: " + PORT);
  });