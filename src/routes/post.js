const express = require("express");
const { userAuth } = require("../middlewares/auth");
const PostModel = require("../model/post");
const { postCreateValidation } = require("../utils/validation");
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
module.exports = postRouter