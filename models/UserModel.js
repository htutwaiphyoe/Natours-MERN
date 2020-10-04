const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username must be provided"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email address must be provided"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Email must be valid"],
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password must be provided"],
        minlength: 8,
    },
    photo: {
        type: String,
        default: "",
    },
    passwordConfirm: {
        type: String,
        required: [true, "Password confirm must be provided"],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
