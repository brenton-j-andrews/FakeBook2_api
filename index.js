const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();

const PORT = 8800;

const app = express();

// Database Config.
const MongoDB = process.env.MONGODB_URL;

mongoose.set("strictQuery", true)
mongoose.connect(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to database");
})

// Application Routing.
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");

// Initialize Middleware.
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

// Initialize Server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})