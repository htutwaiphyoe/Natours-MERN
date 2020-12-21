// third-party modules
const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Missing name"],
            unique: true,
            trim: true,
        },
        slug: String,
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
            select: false,
        },
        secret: {
            type: Boolean,
            default: false,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

tourSchema.virtual("durationInWeeks").get(function () {
    return (this.duration / 7).toFixed(1);
});

tourSchema.pre("save", function (next) {
    this.slug = this.name.split(" ").join("-").toLowerCase();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.find({ secret: { $ne: true } });
    next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
