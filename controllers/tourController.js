// Core modules
const fs = require("fs");

let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

exports.checkId = (req, res, next, val) => {
    req.tour = tours.find((tour) => tour.id === +req.params.id);
    if (!req.tour) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid id",
        });
    }

    next();
};

exports.checkBody = (req, res, next) => {
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
        return res.status(400).json({
            status: "fail",
            message: "Missing name, price, duration",
        });
    }
    next();
};
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
};

exports.addNewTour = (req, res) => {
    const tour = {
        id: tours.length,
        ...req.body,
    };
    tours.push(tour);
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        "utf-8",
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
            res.status(201).json({
                status: "success",
                data: {
                    tour,
                },
            });
        }
    );
};

exports.getSingleTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tour: req.tour,
        },
    });
};

exports.updateSingleTour = (req, res) => {
    req.tour = {
        ...req.tour,
        ...req.body,
    };

    tours[+req.params.id] = req.tour;
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        "utf-8",
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "fail",
                    message: "Server error",
                });
            }
            res.status(200).json({
                status: "success",
                data: {
                    tour: req.tour,
                },
            });
        }
    );
};

exports.deleteSingleTour = (req, res) => {
    tours = tours.filter((tour) => tour.id !== +req.params.id);
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        "utf-8",
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: "fail",
                    message: "Server error",
                });
            }
            res.status(204).json({
                status: "success",
                data: null,
            });
        }
    );
};
