const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { profileEditValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const profile = req.profile
        res.send(profile)
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
        res.json({
            message: `${user.firstName} your profile update successfully`,
            data: user
        });
    } catch (err) {
        res.send(err.message)
    }
});

profileRouter.patch("/profile/passwordedit", userAuth, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new Error("please enter a password")
        }
        const encryptedPass = await bcrypt.hash(password, 10);
        const user = req.profile
        console.log(user);
        user.password = encryptedPass;
        await user.save
        console.log(user);
        res.send("password updated successfully")
    } catch (err) {
        res.send(err.message)
    }
});

module.exports = profileRouter;