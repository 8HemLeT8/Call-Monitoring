const mongoose = require("mongoose");

const URI =
  "mongodb+srv://sniryefet:sniryefet@finalprojectcluster.x0l5f.mongodb.net/FinalProjectDB?retryWrites=true&w=majority";

exports.connectToMongo = async () => {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{console.log("Connected to MongoDB");});
  
};
