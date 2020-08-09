const express = require("express");
const app = express();
const https = require("https");
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
  res.send("Hello World");
});




// server is listening on port 3000
app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});
