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
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === "production") {
        sendProdError(err, res);
    }
};
