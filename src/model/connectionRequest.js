const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejectd'],
            message: '{VALUE} is not a valid status'
        },
        required: true
    }
}, { timestamps: true });

const connectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel