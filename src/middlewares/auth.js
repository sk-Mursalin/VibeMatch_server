const User = require("../model/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies
        const { token } = cookie
        if (!token) {
            throw new Error("invalid token")
        }
        const { _id } = jwt.verify(token, 'virat@123');
        const profile = await User.findById({ _id: _id });
        req.profile = profile
        next();

    } catch (err) {
        res.send(err.message)
    }
}

module.exports = { userAuth }