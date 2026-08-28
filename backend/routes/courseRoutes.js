const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// ==========================================
// Create Course
// ==========================================

router.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            level,
            category,
            instructor,
            lessons,
        } = req.body;

        if (
            !title ||
            !description ||
            price === undefined ||
            !level ||
            !category ||
            !instructor
        ) {
            return res.status(400).json({
                message:
                    "Please provide all course details",
            });
        }

        const course = await Course.create({
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            level: level.trim(),
            category: category.trim(),
            instructor: instructor.trim(),
            lessons: lessons || [],
        });

        res.status(201).json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.log(
            "Create course error:",
            error
        );

        res.status(500).json({
            message: "Failed to create course",
            error: error.message,
        });
    }
});
// ==========================================
// Get All Courses
// ==========================================

router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            message:
                "Courses fetched successfully",
            courses,
        });
    } catch (error) {
        console.log(
            "Fetch courses error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch courses",
            error: error.message,
        });
    }
});

// ==========================================
// Get Single Course
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(
            req.params.id
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json({
            message:
                "Course fetched successfully",
            course,
        });
    } catch (error) {
        console.log(
            "Fetch course error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch course",
            error: error.message,
        });
    }
});

// ==========================================
// Update Course
// ==========================================

router.put("/:id", async (req, res) => {
    try {
        const course =
            await Course.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json({
            message:
                "Course updated successfully",
            course,
        });
    } catch (error) {
        console.log(
            "Update course error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update course",
            error: error.message,
        });
    }
});

// ==========================================
// Delete Course
// ==========================================

router.delete("/:id", async (req, res) => {
    try {
        const course =
            await Course.findByIdAndDelete(
                req.params.id
            );

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json({
            message:
                "Course deleted successfully",
        });
    } catch (error) {
        console.log(
            "Delete course error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete course",
            error: error.message,
        });
    }
});

module.exports = router;
