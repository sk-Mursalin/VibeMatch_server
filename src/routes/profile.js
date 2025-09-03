const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { profileEditValidation, passwordValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const user = require("../model/user");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const profile = req.profile
        res.json({ user: profile });
    } catch (err) {
        res.send(err.message)
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!profileEditValidation(req)) {
            throw new Error("please send editable data");
        }
        const user = req.profile
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save()
        res.json({ user: user });
    } catch (err) {
        res.send(err.message)
    }
});

profileRouter.patch("/profile/passwordedit", userAuth, async (req, res) => {
    try {
        passwordValidation(req)
        const { oldPassword, newPassword } = req.body;
        const user = req.profile
        const isPasswordValid = await user.compareHashPassword(oldPassword)
        if (!isPasswordValid) {
            throw new Error("please enter correct old password")
        }
        const encryptedNewPass = await bcrypt.hash(newPassword, 10);
        user.password = encryptedNewPass;
        await user.save()
        res.send("password updated successfully")
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

profileRouter.get("/profile/get/:ProfileId", userAuth, async (req, res) => {
    try {
        const { ProfileId } = req.params
        const userExist = await user.findOne({ _id: ProfileId }).select("-password -email")
        if (!userExist) {
            throw new Error("user not exist please enter valid userId");
        }
        res.status(200).json({ data: userExist })

    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})

module.exports = profileRouter;