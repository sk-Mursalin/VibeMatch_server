const validator = require("validator");


const signupValidation = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("please enter a valid email")
    }
    else if (firstName.length >= 10 || !lastName.length >= 50) {
        throw new Error("invalid")
    }
}



module.exports = {
    signupValidation,
}