const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    category: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },

    lessons: [
        {
            title: {
                type: String,
                required: true,
            },

            videoUrl: {
                type: String,
                required: true,
            },

            duration: {
                type: String,
                default: "0",
            },
        },
    ],
},
    {
        timestamps: true
    });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;