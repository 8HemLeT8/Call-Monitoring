// INCLUDE
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const redis = require("redis");
const kafka = require('./kafkaConsumer');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create redis Client
let client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

client.on("connect", function(error) {
  console.error("Connected to Redis");
});
 
client.set("key", "value", redis.print);
client.get("key", redis.print);

// MACRO
const PORT = 4000;

// GLOBAL

// set rendering to be with ejs
app.set("view engine", "ejs");

// to enablue use of static files like css files
app.use(express.static("public"));

// ROUTING

app.get("/",function (req,res) {
    res.send("Consumer 1 Home Page");
  });



// server is listening on port 3000
server.listen(PORT || process.env.PORT, function () {
    console.log("Server is running on port: " + PORT);
  });