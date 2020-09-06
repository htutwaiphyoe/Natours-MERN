const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tourname is required"],
            unique: true,
            trim: true,
            maxlength: [40, "Tourname is too long"],
            minlength: [10, "Tourname is too short"],
        },
        duration: {
            type: Number,
            required: [true, "Duration is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Ratings average must be greater than 1"],
            max: [5, "Ratings average must be less than 5"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        maxGroupSize: {
            type: Number,
            required: [true, "MaxGroupSize is required"],
        },
        difficulty: {
            type: String,
            required: [true, "Difficulty is required"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficuly is either 'EASY' or 'MEDIUM' or 'DIFFICULT'",
            },
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value <= this.price;
                },
                message: "Discount price ({VALUE}) must be lower than actual price",
            },
        },
        summary: {
            type: String,
            required: [true, "Summary is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "ImageCover is required"],
            trim: true,
        },
        images: [String],
        createdAt: {
            type: Date,
            default: new Date(),
            select: false,
        },
        startDates: [Date],
        slug: String,
        secret: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    return +(this.duration / 7).toFixed(1);
});

tourSchema.pre("save", function (next) {
    this.slug = this.name.toLowerCase().split(" ").join("-");
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
const tourModel = mongoose.model("Tour", tourSchema);

module.exports = tourModel;
