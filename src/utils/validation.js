const validator = require("validator");


const signupValidation = (req) => {
    const { firstName, lastName, email } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("please enter a valid email")
    }
    else if (firstName.length >= 10 || !lastName.length >= 50) {
        throw new Error("invalid")
    }
}

const profileEditValidation = (req) => {
    const allowEditField = ["firstName", "lastName", "age", "photoUrl", "skill", "gender"];

    const isEditAllowed = Object.keys(req.body).every((el) => allowEditField.includes(el));
    return isEditAllowed
}
module.exports = {
    signupValidation,
    profileEditValidation
}