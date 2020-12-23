// Core modules
const Tour = require("../models/TourModel");
const APIFeatures = require("../utils/APIFeatures");

exports.getTop5 = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,duration,ratingsAverage,difficulty,summary";
    next();
};
exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.addNewTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
exports.getSingleTour = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        // res.status(500).json({
        //     status: "error",
        //     message: err.message,
        // });

        err.statusCode = 404;
        err.status = "fail";
        next(err);
    }
};
exports.updateSingleTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
        });
        res.status(201).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.deleteSingleTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getTourStatistics = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
