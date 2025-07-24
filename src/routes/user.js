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
        }).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender', 'photoUrl']);

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
        }).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender', 'photoUrl'])
            .populate("toUserId", ['firstName', 'lastName', 'age', 'gender', 'photoUrl']);

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

});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit;
        const loggedUser = req.profile;
        const alreadyConnectedUsers = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedUser._id.toString() },
                { toUserId: loggedUser._id.toString() }
            ]
        }).select("fromUserId  toUserId")
        const uniqueConnectedUser = new Set();
        alreadyConnectedUsers.forEach((user) => {
            uniqueConnectedUser.add(user.fromUserId.toString());
            uniqueConnectedUser.add(user.toUserId.toString());
        });

        const feedUser = await User.find({
            $and: [
                { _id: { $nin: [...uniqueConnectedUser] } },
                { _id: { $ne: loggedUser._id } }
            ]
        }).select("firstName lastName age gender skill photoUrl").skip(skip).limit(limit);

        res.send(feedUser)
    } catch (err) {
        res.json({ message: err.message })
    }
});
module.exports = userRouter