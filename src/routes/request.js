const express = require("express");
const mongoose = require("mongoose")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const UserModel = require("../model/user")

requestRouter.post("/connection/:status/:userid", userAuth, async (req, res) => {
    try {
        const fromUserId = req.profile._id;
        const status = req.params.status;
        const toUserId = req.params.userid

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            throw new Error("status is not valid ")
        }
        // if (fromUserId.equals(toUserId)) {
        //     return res.json({ message: "you can not send connection to own" })
        // }
        const toUserIdExist = await UserModel.findById(toUserId);
        if (!toUserIdExist) {
            throw new Error("user not exist");
        }

        const isConnectionHappenPre = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (isConnectionHappenPre) {
            return res.json({ message: "connection was made before" })
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        await connectionRequest.save();
        res.json({ message: ` you are  ${status} ${toUserIdExist.firstName}'s account` });
    } catch (err) {
        res.json({ message: err.message });
    }
});

requestRouter.post("/connection/review/:status/:userid", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.profile;
        const { status, userid } = req.params;

        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            throw new Error("status is not valid ")
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: userid, toUserId: loggedinUser._id, status: "interested"
        });
        if (!connectionRequest) {
            throw new Error("connecton request  not found ");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save()
        res.json({
            mesaage: "connection made ",
            data: data
        })
    } catch (err) {
        res.json({ message: err.message });
    }

});

requestRouter.get("/connections/:userId", userAuth, async (req, res) => {
    try {
        let { userId } = req.params
        userId = new mongoose.Types.ObjectId(userId);

        const allConnections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about'])
            .populate("toUserId", ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about']);

        const finalAllconection = allConnections.map((el) => {
            if (el?.fromUserId == userId) { return el?.toUserId } else { return el?.fromUserId }
        });

        res.status(200).json({ data: finalAllconection })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

module.exports = requestRouter;