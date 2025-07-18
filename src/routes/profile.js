const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const profile = req.profile
        res.send(profile)
    } catch (err) {
        res.send(err.message)
    }
});

module.exports = profileRouter;