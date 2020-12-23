// Core modules
const Tour = require("../models/TourModel");
const APIFeatures = require("../utils/APIFeatures");
const catchError = require("../utils/catchError");
const AppError = require("../utils/AppError");

exports.getTop5 = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,duration,ratingsAverage,difficulty,summary";
    next();
};
exports.getAllTours = catchError(async (req, res, next) => {
    // get query
    const apiFeatures = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .project()
        .paginate();
    // execute query
    const tours = await apiFeatures.query;
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
});

exports.addNewTour = catchError(async (req, res, next) => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            tour,
        },
    });
});
exports.getSingleTour = catchError(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError("No tour found with that id", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    });
});
exports.updateSingleTour = catchError(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    });

    if (!tour) {
        return next(new AppError("No tour found with that id", 404));
    }
    res.status(201).json({
        status: "success",
        data: {
            tour,
        },
    });
});

exports.deleteSingleTour = catchError(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError("No tour found with that id", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getTourStatistics = catchError(async (req, res, next) => {
    const statistics = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numberOfTours: { $sum: 1 },
                numberOfRatings: { $sum: "$ratingsQuantity" },
                averageRating: { $avg: "$ratingsAverage" },
                averagePrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: { averageRating: -1 },
        },
    ]);
    res.status(200).json({
        status: "success",
        results: statistics.length,
        data: {
            statistics,
        },
    });
});

exports.getMonthlyPlan = catchError(async (req, res, next) => {
    const plans = await Tour.aggregate([
        {
            $unwind: "$startDates",
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${req.params.year}-01-01`),
                    $lte: new Date(`${req.params.year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numberOfTours: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        {
            $addFields: { month: "$_id" },
        },
        {
            $project: { _id: 0 },
        },
        {
            $sort: { numberOfTours: -1 },
        },
    ]);
    res.status(200).json({
        status: "success",
        results: plans.length,
        data: {
            plans,
        },
    });
});
