const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const router = express.Router();

// ==========================================
// Create Enrollment
// ==========================================
router.post("/", async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            course,
        } = req.body;

        // Basic validation
        if (
            !studentName?.trim() ||
            !studentEmail?.trim() ||
            !course
        ) {
            return res.status(400).json({
                message:
                    "Please provide student name, email and course",
            });
        }

        const email = studentEmail
            .trim()
            .toLowerCase();

        // Check if course exists
        const existingCourse =
            await Course.findById(course);

        if (!existingCourse) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Check duplicate enrollment
        const existingEnrollment =
            await Enrollment.findOne({
                studentEmail: email,
                course: course,
            });

        if (existingEnrollment) {
            return res.status(400).json({
                message:
                    "You are already enrolled in this course",
            });
        }

        // Create enrollment
        const enrollment =
            await Enrollment.create({
                studentName: studentName.trim(),
                studentEmail: email,
                course: course,
                progress: 0,
                completedLessons: [],
            });

        // Populate course
        await enrollment.populate("course");

        res.status(201).json({
            message: "Enrollment successful",
            enrollment,
        });

    } catch (error) {
        console.log(
            "Enrollment error:",
            error
        );

        res.status(500).json({
            message: "Enrollment failed",
            error: error.message,
        });
    }
});


// ==========================================
// Get Student Enrollments
// ==========================================
router.get("/", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email?.trim()) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const enrollments =
            await Enrollment.find({
                studentEmail:
                    email.trim().toLowerCase(),
            })
                .populate("course")
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            message:
                "Enrollments fetched successfully",
            enrollments,
        });

    } catch (error) {
        console.log(
            "Fetch enrollments error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch enrollments",
            error: error.message,
        });
    }
});


// ==========================================
// Get All Enrollments - Admin
// ==========================================
router.get("/admin/all", async (req, res) => {
    try {
        const enrollments =
            await Enrollment.find()
                .populate("course")
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            message:
                "All enrollments fetched successfully",
            enrollments,
        });

    } catch (error) {
        console.log(
            "Fetch all enrollments error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch all enrollments",
            error: error.message,
        });
    }
});


// ==========================================
// Update Course Progress
// ==========================================
router.put("/:id/progress", async (req, res) => {
    try {
        const { progress } = req.body;

        if (progress === undefined) {
            return res.status(400).json({
                message: "Progress is required",
            });
        }

        const progressNumber = Number(progress);

        // Validate progress
        if (
            Number.isNaN(progressNumber) ||
            progressNumber < 0 ||
            progressNumber > 100
        ) {
            return res.status(400).json({
                message:
                    "Progress must be between 0 and 100",
            });
        }

        const enrollment =
            await Enrollment.findByIdAndUpdate(
                req.params.id,
                {
                    progress: progressNumber,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("course");

        if (!enrollment) {
            return res.status(404).json({
                message:
                    "Enrollment not found",
            });
        }

        res.status(200).json({
            message:
                "Course progress updated successfully",
            enrollment,
        });

    } catch (error) {
        console.log(
            "Update progress error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update progress",
            error: error.message,
        });
    }
});


// ==========================================
// Mark Lesson as Completed
// ==========================================
router.put(
    "/:id/lessons/:lessonId/complete",
    async (req, res) => {
        try {
            const {
                id,
                lessonId,
            } = req.params;

            // Find enrollment
            const enrollment =
                await Enrollment.findById(id)
                    .populate("course");

            if (!enrollment) {
                return res.status(404).json({
                    message:
                        "Enrollment not found",
                });
            }

            // Check course
            if (!enrollment.course) {
                return res.status(404).json({
                    message:
                        "Course not found",
                });
            }

            // Check lesson exists
            const lessonExists =
                enrollment.course.lessons.some(
                    (lesson) =>
                        lesson._id.toString() ===
                        lessonId
                );

            if (!lessonExists) {
                return res.status(404).json({
                    message:
                        "Lesson not found in this course",
                });
            }

            // Check if already completed
            const alreadyCompleted =
                enrollment.completedLessons.some(
                    (completedLesson) =>
                        completedLesson.toString() ===
                        lessonId
                );

            // Add lesson
            if (!alreadyCompleted) {
                enrollment.completedLessons.push(
                    lessonId
                );
            }

            // Total lessons
            const totalLessons =
                enrollment.course.lessons.length;

            // Completed lessons
            const completedLessons =
                enrollment.completedLessons.length;

            // Calculate progress
            const progress =
                totalLessons > 0
                    ? Math.round(
                        (completedLessons /
                            totalLessons) *
                        100
                    )
                    : 0;

            // Save progress
            enrollment.progress = progress;

            await enrollment.save();

            // Populate course
            await enrollment.populate("course");

            res.status(200).json({
                message: alreadyCompleted
                    ? "Lesson already completed"
                    : "Lesson marked as completed",

                enrollment,
            });

        } catch (error) {
            console.log(
                "Complete lesson error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to complete lesson",
                error: error.message,
            });
        }
    }
);


// ==========================================
// Delete / Cancel Enrollment
// ==========================================
router.delete("/:id", async (req, res) => {
    try {
        const enrollment =
            await Enrollment.findByIdAndDelete(
                req.params.id
            );

        if (!enrollment) {
            return res.status(404).json({
                message:
                    "Enrollment not found",
            });
        }

        res.status(200).json({
            message:
                "Enrollment cancelled successfully",
        });

    } catch (error) {
        console.log(
            "Delete enrollment error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to cancel enrollment",
            error: error.message,
        });
    }
});


module.exports = router;