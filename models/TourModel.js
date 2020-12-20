// third-party modules
const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Missing name"],
        unique: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, "Missing duration"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "Missing maxGroupSize"],
    },
    difficulty: {
        type: String,
        required: [true, "Missing difficulty"],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
    },
    discount: Number,
    summary: {
        type: String,
        required: [true, "Missing summary"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Missing summary"],
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "Missing imageCover"],
        trim: true,
    },
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
