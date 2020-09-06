const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/TourModel");

// Get env data
dotenv.config({ path: "../../config.env" });

// Get DB connection
const dbString = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASS);
mongoose
    .connect(dbString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connects successfully!"))
    .catch((error) => console.log(error));

// Get data from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

// import data
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Imported");
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// delete data
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Deleted");
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// execute method
if (process.argv[2] === "--import") {
    importData();
}
if (process.argv[2] === "--delete") {
    deleteData();
}
