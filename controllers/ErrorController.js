const AppError = require("../utils/AppError");

const castErrorHandler = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};

const duplicateErrorHandler = (err) => {
    const field = err.message.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/)[0];
    return new AppError(`Duplicate field value: ${field}`, 400);
};
const sendDevErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};
const sendProdErrors = (err, res) => {
    // User input is invalid or others
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // coding error
    else {
        // log to hosting console
        console.error("Error ", err);

        // send generic error to client
        res.status(500).json({
            status: "error",
            message: "Oh! Something went wrong.",
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV !== "production") {
        sendDevErrors(err, res);
    } else {
        // mongoose give error name for each error
        if (err.name === "CastError") {
            // creating own error to make isOperational to equal to true
            err = castErrorHandler(err);
        }
        if (err.code === 11000) {
            err = duplicateErrorHandler(err);
        }
        sendProdErrors(err, res);
    }
};
