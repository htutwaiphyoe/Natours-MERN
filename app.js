const express = require("express");
const morgan = require("morgan");
const TourRouter = require("./routes/TourRouter");
const UserRouter = require("./routes/UserRouter");

const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use("/api/v2/users", UserRouter);
app.use("/api/v2/tours", TourRouter);
app.all("*", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} in this page`);
    err.statusCode = 404;
    err.status = "fail";
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
module.exports = app;
