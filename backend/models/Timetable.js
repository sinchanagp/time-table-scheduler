const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    day: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    faculty: {
        type: String,
        required: true
    },

    room: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);