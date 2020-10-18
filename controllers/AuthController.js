const User = require("../models/UserModel");
const errorHandler = require("../utils/errorHandler");

exports.signup = errorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        data: {
            newUser,
        },
    });
});
