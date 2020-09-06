const Tour = require("../models/TourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getTopFiveTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";

    next();
};

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.addNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getSingleTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.updateSingleTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: "fail",
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
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(200).json({
            status: "fail",
            message: err.message,
        });
    }
};
