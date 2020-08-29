// INCLUDE
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const redis = require("redis");
const kafka = require("./kafkaConsumer");
const schedule = require("node-schedule");
const statistics = require("./statistics/statistics.js");

// set rendering to be with ejs
app.set("view engine", "ejs");

// to enablue use of static files like css files
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create redis Client
let client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

client.on("connect", function (error) {
  console.error("Connected to Redis");
});

let rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;

schedule.scheduleJob(rule, function () {
  client.flushdb();
  console.log("Redis DB Flushed!");
});

// MACRO
const PORT = 4000 || process.env.PORT;

// GLOBAL

// ROUTING

app.get("/", function (req, res) {
  statistics.calcStatistics().then((stats)=>{
    console.log(stats);
    res.render("dashboard",stats)
    // res.render("dashboard", {
    //   waitingCalls: 50,
    //   aggWaitingCalls: [10, 20, 30],
    //   waitingTime: 30,
    //   aggWaitingTime: [40, 50, 60],
    //   distByReq: [70, 80, 90],
    //   distByLanguage: [90, 80, 70],
    //   numOfCallsByArea: [],
    //   numOfallsByTopic: [],
    // });
  });
  
});

// server is listening on port 3000
server.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});
