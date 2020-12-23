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

app.all("*", (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});

// global error handing middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
module.exports = app;
