const validator = require("validator");


const signupValidation = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("please enter a valid email")
    }
    else if (firstName.length >= 20 || lastName.length >= 30) {
        throw new Error("please enter small name")
    }
    if (!password) {
        throw new Error("please enter password")
    } else if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.")
    }
}

const profileEditValidation = (req) => {
    const allowEditField = ["firstName", "lastName", "age", "photoUrl", "skill", "gender","about"];

    const isEditAllowed = Object.keys(req.body).every((el) => allowEditField.includes(el));
    return isEditAllowed
}
const passwordValidation = (req) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword) {
        throw new Error("please enter a oldpassword")
    } else if (!newPassword) {
        throw new Error("please enter new password")
    }

    if (newPassword.length < 6) {
        throw new Error("newpassword should at least 6 character")
    }
}
module.exports = {
    signupValidation,
    profileEditValidation,
    passwordValidation
}