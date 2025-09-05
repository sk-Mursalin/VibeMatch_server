const express = require("express");
const { userAuth } = require("../middlewares/auth");
const PostModel = require("../model/post");
const { postCreateValidation } = require("../utils/validation");
const mongoose = require("mongoose");
const postRouter = express.Router();

postRouter.post("/post/create", userAuth, async (req, res) => {
    try {
        postCreateValidation(req);
        const { content, postPhoto } = req.body
        const _id = req.profile._id
        const newPost = new PostModel({
            content,
            postPhoto,
            postCreatedBy: _id
        });
        await newPost.save();
        res.status(201).json({ data: newPost })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

postRouter.get("/post/get", userAuth, async (req, res) => {
    try {
        const allPost = await PostModel.find({}).populate("postCreatedBy", "firstName  lastName  photoUrl")
        res.status(200).json({ data: allPost })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

postRouter.get("/post/get/:userId", userAuth, async (req, res) => {
    try {
        const { userId } = req.params
        const allPost = await PostModel.find({ postCreatedBy: new mongoose.Types.ObjectId(userId) }).populate("postCreatedBy", "firstName  lastName  photoUrl about")
        res.status(200).json({ data: allPost })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


postRouter.patch("/post/like/:postId", userAuth, async (req, res) => {
    try {
        const { postId } = req.params;
        const { _id } = req.profile;
        const postData = await PostModel.findOne({ _id: postId });
        if (!postData) {
            return res.status(400).json({ data: "please give a valid postId" });
        }

        if (postData.like.includes(_id)) {
            await PostModel.findByIdAndUpdate(
                postId,
                { $pull: { like: _id } }
            )
            return res.status(200).json({ message: "unlike" })
        } else {
            await PostModel.findByIdAndUpdate(
                postId,
                { $addToSet: { like: _id } }
            )
            return res.status(200).json({ message: "like" })
        }
    } catch (err) {
        res.json({ data: err.message })
    }
});

module.exports = postRouter