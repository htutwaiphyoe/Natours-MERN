const Tour = require("../models/TourModel");
const APIFeatures = require("../utils/apiFeatures");
const errorHandler = require("../utils/errorHandler");

exports.getTopFiveTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";

    next();
};

exports.getAllTours = errorHandler(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .projectFields()
        .paginate();

    const tours = await apiFeatures.query;
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours,
        },
    });
});

exports.addNewTour = errorHandler(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour,
        },
    });
});

exports.getSingleTour = errorHandler(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    });
});

exports.updateSingleTour = errorHandler(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            tour: updatedTour,
        },
    });
});

exports.deleteSingleTour = errorHandler(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getTourStats = errorHandler(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        // {
        //     $match: { _id: { $ne: "MEDIUM" } },
        // },
    ]);

    res.status(200).json({
        status: "success",
        data: {
            stats,
        },
    });
});

exports.getMonthlyPlan = errorHandler(async (req, res, next) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates",
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTours: { $sum: 1 },
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
            $sort: { month: 1 },
        },
        {
            $limit: 2,
        },
    ]);

    res.status(200).json({
        status: "success",
        results: plan.length,
        data: {
            plan,
        },
    });
});
