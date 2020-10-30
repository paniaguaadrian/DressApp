require('dotenv').config();
const bodyParser = require('body-parser')
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs")



// * Import Connection from DB
const connectDB = require("./config/db");


// * Call our function to connect to DB
connectDB();
const closetRouter = require('./routes/private/closet');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", ".hbs");
app.use('/', closetRouter);


const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


