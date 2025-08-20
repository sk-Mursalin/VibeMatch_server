const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
    },
    postPhoto: {
        type: String
    },
}, { timestamps: true })

const PostModel = mongoose.model("postSchema", postSchema);

module.exports = PostModel