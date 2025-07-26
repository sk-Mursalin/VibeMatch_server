const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        required: true
    }
}, { timestamps: true });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest1 = this
    if (connectionRequest1.fromUserId.equals(this.toUserId)) {
        throw new Error("can't send connection request to yourself")
    }
    next()
})

const connectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel