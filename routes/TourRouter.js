const express = require("express");
const TourController = require("../controllers/TourController");

const router = express.Router();

// router.param("id", TourController.checkId);
router.route("/top-five").get(TourController.getTopFiveTours, TourController.getAllTours);
router.route("/tour-stats").get(TourController.getTourStats);
router.route("/monthly-plan/:year").get(TourController.getMonthlyPlan);
router.route("/").get(TourController.getAllTours).post(TourController.addNewTour);

router
    .route("/:id")
    .get(TourController.getSingleTour)
    .patch(TourController.updateSingleTour)
    .delete(TourController.deleteSingleTour);

module.exports = router;
