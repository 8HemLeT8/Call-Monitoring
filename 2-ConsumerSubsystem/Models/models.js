

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CallSchema= new Schema({
    id:{type: String, required:true},
    city:{type: String},
    topic:{type: String},
    language:{type: String},
    gender:{type: String},
    age:{type: String},
    totalTime:{type: Number}

});

const Model = mongoose.model("Calls",CallSchema);
module.exports = Model;
