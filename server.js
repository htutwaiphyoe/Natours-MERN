// third-party modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
    console.error("Uncaught exceptions occurred", err);
    process.exit(1);
});
dotenv.config({ path: `./.env` });
// Own modules
const app = require("./app");

const dbString = process.env.DB_CONNECTION_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

if (process.env.NODE_ENV === "development") {
    mongoose.connection.on("connected", () => {
        console.error("Database connection established successfully");
    });
    mongoose.connection.on("disconnected", (err) => {
        console.error("Database connection failed");
    });
    mongoose.connection.on("error", (err) => {
        console.error("Database connection failed");
    });
}

// Server configuration
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection occurred", err);
    server.close(() => {
        process.exit(1);
    });
});
