// Importing required modules
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

// parse env variables
require("dotenv").config();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Defining route middleware
app.use("/api", require("./routes/api"));
app.use("/user", require("./routes/userAuth"));

// Listening to port

mongoose
  .connect(process.env.MONGO, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(port, () => console.log("Listening on port " + port)))
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
