const express = require("express");
const connectionRequestModel = require("../model/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedUser = req.profile;

        const requestsUsers = await connectionRequestModel.find({
            toUserId: loggedUser._id,
            status: "interested"
        }).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender']);

        res.json({ data: requestsUsers });
    } catch (err) {
        res.json({ message: err.message })
    }
});

userRouter.get("/user/allconnection", userAuth, async (req, res) => {
    try {
        const loggedUser = req.profile;
        const allConnection = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedUser._id, status: "accepted" },
                { toUserId: loggedUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender'])
            .populate("toUserId", ['firstName', 'lastName', 'age', 'gender']);
        console.log(allConnection);

        const finalAllconection = allConnection.map((row) => {
            if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data: finalAllconection })
    } catch (err) {
        res.json({ message: err.message })
    }

})
module.exports = userRouter