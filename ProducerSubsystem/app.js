// INCLUDE
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const kafka = require('./kafkaProduce');
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MACRO
const PORT = 3000;

// GLOBAL

// set rendering to be with ejs
app.set("view engine", "ejs");

// to enablue use of static files like css files
app.use(express.static("public"));

// ROUTING

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/send", function (req, res) {
  res.render("sender");
});

app.get("/view", function (req, res) {
  res.render("viewer");
});

//------------ Socket.io ----------------
io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("totalWaitingCalls", (msg) => {
    console.log(msg.totalWaiting);
  });

  socket.on("callDetails", (msg) => {
    console.log(msg);
    kafka.publishToFastRoute(msg);
    kafka.publishToSlowRoute(msg);
  });
  

  //end on
});

//------------------- kafka -----------
/* Kafka Producer Configuration */


// WHEN THE SERVER GET THE INFO ???

//
//const client1 = new kafka.KafkaClient({kafkaHost: "localhost:9092"});

// server is listening on port 3000
server.listen(PORT || process.env.PORT, function () {
  console.log("Server is running on port: " + PORT);
});
