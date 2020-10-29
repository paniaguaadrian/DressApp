const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const hbs = require("hbs");
const passport = require("passport");
const session = require("express-session");

// * Import Connection from DB
const connectDB = require("./config/db");

// * Load config
dotenv.config({ path: "./config/config.env" });

// * Passport config
require("./config/passport")(passport);

// * Call our function to connect to DB
connectDB();

const app = express();

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

// * Sessions middleware
app.use(
  session({
    secret: "dressapp", // whatever we want
    resave: false,
    saveUninitialized: false, // Don't create a session until something is stored on the DB.
  })
);

// * Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// * Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/authG"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
