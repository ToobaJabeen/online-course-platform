const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
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

        // Course کی مجموعی progress
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // Student نے جو lessons complete کیے ہیں
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model(
    "Enrollment",
    enrollmentSchema
);

module.exports = Enrollment;