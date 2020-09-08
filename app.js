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
app.all("*", (req, res) => {
    res.status(404).json({
        result: "fail",
        message: `Can't find ${req.originalUrl} on this server`,
    });
});
module.exports = app;
