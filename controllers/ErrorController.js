const AppError = require("../utils/AppError");

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
const castErrorHandler = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV !== "production") {
        sendDevErrors(err, res);
    } else {
        if (err.name === "CastError") {
            err = castErrorHandler(err);
        }
        sendProdErrors(err, res);
    }
};
