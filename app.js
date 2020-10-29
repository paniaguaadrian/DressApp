const express = require("express");
const dotenv = require("dotenv");


// * Import Connection from DB
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

// * Call our function to connect to DB
connectDB();

const app = express();


const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


