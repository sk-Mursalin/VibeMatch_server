const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/connectionrequest", userAuth, (req, res) => {
    const user = req.profile;
    res.send("connection send from " + user.firstName);
});

module.exports = requestRouter;