// own modules
const AppError = require("../utils/AppError");

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        name: err.name,
        error: err,
        stack: err.stack,
    });
};

const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "Oops! Something went wrong 💥.",
        });
    }
};

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateKeyError = (err) => {
    const message = `${Object.keys(err.keyValue).join(" ")}: ${err.keyValue.name} already exists.`;
    return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError") err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateKeyError(err);
        sendProdError(err, res);
    }
};
