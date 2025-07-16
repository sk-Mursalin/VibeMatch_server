const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        trim: true
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("please enter valid email")
            }
        }
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("enter a valid gender")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    skill: {
        type: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)