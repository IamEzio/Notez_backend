const mongoose = require("mongoose");

const mongoURI =
  "mongodb://localhost:27017/notez?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo = async () => {
  mongoose.connect(mongoURI, () => {
    console.log("Database connected.");
  });
};

module.exports = connectToMongo;
