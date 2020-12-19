// third-party modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");

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

mongoose.connection.on("connected", () => {
    console.log("Database connection established successfully");
});

mongoose.connection.on("error", (err) => {
    console.log("Database connection failed");
});

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Missing name"],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
    },
    rating: {
        type: Number,
        default: 4.5,
    },
});

const Tour = mongoose.model("Tour", tourSchema);

const tour = new Tour({
    name: "Test 2",
});

tour.save()
    .then(() => {
        console.log("Tour saved");
    })
    .catch((err) => {
        console.log(err.message);
    });

// Server configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {});
