// Core modules
const Tour = require("../models/TourModel");

exports.getAllTours = async (req, res) => {
    try {
        // Filtering
        let urlQuery = { ...req.query };
        const excludedFields = ["limit", "sort", "page", "fields"];
        excludedFields.forEach((field) => delete urlQuery[field]);

        // Advenced filtering
        urlQuery = JSON.parse(
            JSON.stringify(urlQuery).replace(/\b(gt|lt|gte|lte|ne)\b/g, (match) => `$${match}`)
        );
        console.log(urlQuery, req.query);
        let query = Tour.find(urlQuery);

        // sorting
        if (req.query.sort) {
            query = query.sort(req.query.sort.split(",").join(" "));
        } else {
            query = query.sort("-createdAt");
        }

        // fields limiting
        if (req.query.fields) {
            query = query.select(req.query.fields.split(",").join(" "));
        } else {
            query = query.select("-__v");
        }
        const tours = await query;
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
        res.status(500).json({
            status: "error",
            message: err.message,
        });
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
