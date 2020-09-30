const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
    console.error("Internal Server Error");

    process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = 3000 || process.env.PORT;
const dbString = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASS);
mongoose
    .connect(dbString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    });

const server = app.listen(port, () => {
    console.log("Server listening");
});

process.on("unhandledRejection", () => {
    console.error("Internal Server Error");
    server.close(() => {
        process.exit(1);
    });
});
