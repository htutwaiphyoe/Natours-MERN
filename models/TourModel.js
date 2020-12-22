// third-party modules
const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Missing name"],
            unique: true,
            trim: true,
            minLength: [10, "Name must be at least 10 characters"],
            maxLength: [40, "Name must be at most 40 characters"],
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z ]*$/.test(value);
                },
                message: "Name must be only characters",
            },
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
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty must be either easy or medium or difficult",
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Missing price"],
        },
        discount: {
            type: Number,
            validate: {
                validator: function (value) {
                    return (value / 100) * this.price < this.price;
                },
                message: "Discount must be between 0 and 100. ({VALUE})",
            },
        },
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

tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secret: { $ne: true } } });
    next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
