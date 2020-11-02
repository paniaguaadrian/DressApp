require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// * Import Connection from DB
const connectDB = require("./config/db");

// * Call our function to connect to DB
connectDB();

// * Routes to auth.js for normal login
const authRouter = require("./routes/auth");
const authIndex = require("./routes/index");
const closetRouter = require("./routes/private/closet");
const profileRouter = require("./routes/private/profile");
const communityRouter = require("./routes/private/community");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// * Login
if (process.env.NODE_ENV === "development") {
  // * Middleware
  app.use(morgan("dev"));
}

// * Handlebars middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// * Static folder
app.use(express.static(path.join(__dirname, "public")));

// * Partials folder
hbs.registerPartials(__dirname + "/views/partials");

// * Sessions middleware
app.use(
  session({
    secret: "dressapp", // whatever we want
    resave: false,
    saveUninitialized: false, // Don't create a session until something is stored on the DB.
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// * Routes
app.use("/", authIndex);
app.use("/auth", authRouter);
app.use("/mycloset", closetRouter);
app.use("/myprofile", profileRouter);
app.use("/mycommunity", communityRouter);

// * Call our function to connect to DB

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

module.exports = app;
