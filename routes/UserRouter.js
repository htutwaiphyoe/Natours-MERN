const express = require("express");
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/AuthController");

const router = express.Router();
router.post("/signup", AuthController.signup);
router.route("/").get(UserController.getAllUsers).post(UserController.addNewUser);

router
    .route("/:id")
    .get(UserController.getSingleUser)
    .patch(UserController.updateSingleUser)
    .delete(UserController.deleteSingleUser);

module.exports = router;
