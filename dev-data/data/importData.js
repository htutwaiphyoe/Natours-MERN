// core modules
const fs = require("fs");

// third-party modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// own modules
const Tour = require("../../models/TourModel");

dotenv.config({ path: `./.env` });

const dbString = process.env.DB_CONNECTION_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
    console.log("Database connection established successfully");
});

mongoose.connection.on("error", (err) => {
    console.log("Database connection failed");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf8"));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data loaded successfully");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany({});
        console.log("Data deleted successfully");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
