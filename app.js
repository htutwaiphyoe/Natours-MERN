// Core modules
// third-party modules
const express = require("express");
const morgan = require("morgan");
// Own modules
const tourRouter = require("./routers/tourRouter");
const userRouter = require("./routers/userRouter");

const app = express();

// Middlewares
// body parser
app.use(express.json());
// logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// static files
app.use(express.static(`${__dirname}/public`));

// Route handlers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
