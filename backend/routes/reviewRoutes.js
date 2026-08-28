
const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// ==========================================
// Add Review
// ==========================================
router.post("/", async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            course,
            rating,
            comment,
        } = req.body;

        if (
            !studentName ||
            !studentEmail ||
            !course ||
            !rating ||
            !comment
        ) {
            return res.status(400).json({
                message:
                    "Please provide all review details",
            });
        }

        const email = studentEmail
            .trim()
            .toLowerCase();

        const ratingNumber = Number(rating);

        if (
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            return res.status(400).json({
                message:
                    "Rating must be between 1 and 5",
            });
        }

        // Check if user already reviewed this course
        const existingReview =
            await Review.findOne({
                studentEmail: email,
                course: course,
            });

        if (existingReview) {
            return res.status(400).json({
                message:
                    "You have already reviewed this course",
            });
        }

        const review = await Review.create({
            studentName: studentName.trim(),
            studentEmail: email,
            course: course,
            rating: ratingNumber,
            comment: comment.trim(),
        });

        res.status(201).json({
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        console.log(
            "Add review error:",
            error
        );

        res.status(500).json({
            message: "Failed to add review",
            error: error.message,
        });
    }
});

// ==========================================
// Get Reviews For Course
// ==========================================
router.get("/:courseId", async (req, res) => {
    try {
        const reviews = await Review.find({
            course: req.params.courseId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            message:
                "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        console.log(
            "Fetch reviews error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
});

module.exports = router;
