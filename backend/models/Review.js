
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true,
        },

        studentEmail: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model(
    "Review",
    reviewSchema
);

module.exports = Review;

