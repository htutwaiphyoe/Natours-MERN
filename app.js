const express = require("express");
const morgan = require("morgan");
const TourRouter = require("./routes/TourRouter");
const UserRouter = require("./routes/UserRouter");
const AppError = require("./utils/AppError");
const ErrorController = require("./controllers/ErrorController");

const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use("/api/v2/users", UserRouter);
app.use("/api/v2/tours", TourRouter);
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} in this page`, 404));
});

app.use(ErrorController);
module.exports = app;
