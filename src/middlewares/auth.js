const User = require("../model/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {
        const token  = req.cookies?.token
        if (!token) {
            return res.status(401).send("please log in ");
        }

        const { _id } = jwt.verify(token,process.env.JWT_PASSKEY);
        const profile = await User.findById({ _id: _id });
        req.profile = profile
        next();

    } catch (err) {
        res.send(err.message)
    }
}

module.exports = { userAuth }