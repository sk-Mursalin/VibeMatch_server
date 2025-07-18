const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error("please enter valid email")
        //     }
        // }
    },
    password: {
        type: String,
        required: true
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

userSchema.methods.getJwt = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "virat@123");
    return token;
}

userSchema.methods.compareHashPassword = async function (inputPasswordByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputPasswordByUser, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)