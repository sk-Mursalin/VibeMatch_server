const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { signupValidation } = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
    try {
        signupValidation(req)
        const { email, password, lastName, firstName } = req.body
        const encryptedPass = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            email,
            password: encryptedPass
        });
        const savedUser = await user.save()
        const token = user.getJwt();
        res.cookie("token", token);
        
        res.json({ user: savedUser });
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        if (!validator.isEmail(email)) {
            throw new Error("please enter a valid email")
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(404).send("please sign up")
        }
        const isPasswordValid = await user.compareHashPassword(password)
        if (!isPasswordValid) {
            res.status(400).send("invalid credential")
        } else {
            const token = user.getJwt();
            res.cookie("token", token);
            res.json({ user: user });
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", '', { expire: new Date(0) })
    res.send("logout successfully");
})

module.exports = authRouter;