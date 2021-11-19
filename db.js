const mongoose = require("mongoose");

const mongoURI =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo = async () => {
  mongoose.connect("mongodb://localhost:27017/test", () => {
    console.log("Database connected.");
  });
};

module.exports = connectToMongo;
