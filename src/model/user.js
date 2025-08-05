const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
    },
    password: {
        type: String,
        required: true,
        min:6
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
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU"
    },
    about:{
        type:String,
        default:"Hi there! I'm using VibeMatch to connect and grow with people"
    }

}, { timestamps: true });

userSchema.methods.getJwt = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_PASSKEY);
    return token;
}

userSchema.methods.compareHashPassword = async function (inputPasswordByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputPasswordByUser, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)