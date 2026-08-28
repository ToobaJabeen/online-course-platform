import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [message, setMessage] = useState("");

    // ==========================================
    // Logged-in Student
    // ==========================================

    const [studentName, setStudentName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    // ==========================================
    // Enrollment
    // ==========================================

    const [enrollment, setEnrollment] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);

    // ==========================================
    // Reviews
    // ==========================================

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");

    // ==========================================
    // Load Logged-in User
    // ==========================================

    const loadUser = () => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            setUserLoggedIn(false);
            return;
        }

        try {
            const user = JSON.parse(savedUser);

            if (user?.name && user?.email) {
                setStudentName(user.name);
                setStudentEmail(user.email);
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        } catch (error) {
            console.log("User parse error:", error);
            setUserLoggedIn(false);
        }
    };

    // ==========================================
    // Load Student Enrollment
    // ==========================================

    const loadEnrollment = async (courseId) => {
        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                setEnrollment(null);
                setCompletedLessons([]);
                return;
            }

            const user = JSON.parse(savedUser);

            if (!user?.email) {
                setEnrollment(null);
                setCompletedLessons([]);
                return;
            }

            const response = await axios.get(
                "http://localhost:3000/api/enrollments",
                {
                    params: {
                        email: user.email.trim().toLowerCase(),
                    },
                }
            );

            const userEnrollments =
                response.data.enrollments || [];

            const currentEnrollment =
                userEnrollments.find(
                    (item) =>
                        item.course?._id?.toString() ===
                        courseId?.toString()
                );

            if (currentEnrollment) {
                setEnrollment(currentEnrollment);

                setCompletedLessons(
                    currentEnrollment.completedLessons || []
                );
            } else {
                setEnrollment(null);
                setCompletedLessons([]);
            }
        } catch (error) {
            console.log(
                "Enrollment load error:",
                error
            );

            setEnrollment(null);
            setCompletedLessons([]);
        }
    };

    // ==========================================
    // Enroll
    // ==========================================

    const handleEnroll = async () => {
        if (
            !studentName.trim() ||
            !studentEmail.trim()
        ) {
            setMessage(
                "Please login or enter your name and email"
            );
            return;
        }

        if (!course?._id) {
            setMessage(
                "Course information is missing"
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/enrollments",
                {
                    studentName: studentName.trim(),

                    studentEmail:
                        studentEmail
                            .trim()
                            .toLowerCase(),

                    course: course._id,
                }
            );

            setMessage(response.data.message);

            await loadEnrollment(course._id);

        } catch (error) {
            console.log(
                "Enrollment error:",
                error
            );

            if (
                error.response?.data?.message ===
                "You are already enrolled in this course"
            ) {
                await loadEnrollment(course._id);
            }

            setMessage(
                error.response?.data?.message ||
                "Enrollment failed"
            );
        }
    };

    // ==========================================
    // Mark Lesson as Completed
    // ==========================================

    const handleCompleteLesson = async (lessonId) => {
        if (!enrollment?._id) {
            setMessage(
                "Please enroll in this course first"
            );
            return;
        }

        if (!lessonId) {
            setMessage(
                "Lesson ID is missing"
            );
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/api/enrollments/${enrollment._id}/lessons/${lessonId}/complete`
            );

            const updatedEnrollment =
                response.data.enrollment;

            setEnrollment(updatedEnrollment);

            setCompletedLessons(
                updatedEnrollment.completedLessons || []
            );

            setMessage(
                response.data.message
            );

        } catch (error) {
            console.log(
                "Complete lesson error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to complete lesson"
            );
        }
    };

    // ==========================================
    // Check Lesson Completed
    // ==========================================

    const isLessonCompleted = (lessonId) => {
        return completedLessons.some(
            (completedLesson) =>
                completedLesson?.toString() ===
                lessonId?.toString()
        );
    };

    // ==========================================
    // Load Reviews
    // ==========================================

    const loadReviews = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/reviews/${id}`
            );

            setReviews(
                response.data.reviews || []
            );

        } catch (error) {
            console.log(
                "Reviews error:",
                error
            );

            setReviews([]);
        }
    };

    // ==========================================
    // Submit Review
    // ==========================================

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            setReviewMessage(
                "Please login before submitting a review"
            );
            return;
        }

        let user;

        try {
            user = JSON.parse(savedUser);
        } catch (error) {
            console.log(
                "User parse error:",
                error
            );

            setReviewMessage(
                "Invalid user information"
            );

            return;
        }

        if (!user?.name || !user?.email) {
            setReviewMessage(
                "User information is incomplete"
            );
            return;
        }

        if (!comment.trim()) {
            setReviewMessage(
                "Please write a review"
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/reviews",
                {
                    studentName: user.name,
                    studentEmail: user.email,
                    course: id,
                    rating: Number(rating),
                    comment: comment.trim(),
                }
            );

            setReviewMessage(
                response.data.message
            );

            setComment("");
            setRating(5);

            await loadReviews();

        } catch (error) {
            console.log(
                "Review error:",
                error
            );

            setReviewMessage(
                error.response?.data?.message ||
                "Failed to add review"
            );
        }
    };

    // ==========================================
    // Load Course + User + Enrollment + Reviews
    // ==========================================

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const response =
                    await axios.get(
                        `http://localhost:3000/api/courses/${id}`
                    );

                const courseData =
                    response.data.course;

                setCourse(courseData);

                await loadEnrollment(
                    courseData._id
                );

            } catch (error) {
                console.log(
                    "Course error:",
                    error
                );
            }
        };

        loadUser();
        loadCourse();
        loadReviews();

    }, [id]);

    // ==========================================
    // Average Rating
    // ==========================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (total, review) =>
                        total +
                        Number(review.rating),
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";

    // ==========================================
    // Loading
    // ==========================================

    if (!course) {
        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }

    // ==========================================
    // Course Progress
    // ==========================================

    const totalLessons =
        course.lessons?.length || 0;

    const completedCount =
        completedLessons.length;

    const courseProgress =
        totalLessons > 0
            ? Math.round(
                (completedCount /
                    totalLessons) *
                100
            )
            : 0;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="container">

            <div className="course-details-card">

                {/* Course Information */}

                <h1>
                    {course.title}
                </h1>

                <p className="course-description">
                    {course.description}
                </p>

                <h2 className="course-price">
                    Rs. {course.price}
                </h2>

                <div className="course-details-info">

                    <p>
                        <strong>
                            Level:
                        </strong>{" "}
                        {course.level}
                    </p>

                    <p>
                        <strong>
                            Category:
                        </strong>{" "}
                        {course.category}
                    </p>

                    <p>
                        <strong>
                            Instructor:
                        </strong>{" "}
                        {course.instructor}
                    </p>

                    <p>
                        <strong>
                            Lessons:
                        </strong>{" "}
                        {totalLessons}
                    </p>

                </div>

                {/* Course Progress */}

                {enrollment && (
                    <div className="progress-section">

                        <div className="progress-header">

                            <strong>
                                My Course Progress
                            </strong>

                            <span>
                                {courseProgress}%
                            </span>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width:
                                        `${courseProgress}%`,
                                }}
                            ></div>

                        </div>

                        {courseProgress === 100 ? (
                            <div className="completion-message">
                                🎉 Course Completed!
                            </div>
                        ) : (
                            <div className="progress-status">
                                📚 In Progress
                            </div>
                        )}

                    </div>
                )}

                {/* ==========================================
                    Course Lessons
                ========================================== */}

                <div className="lessons-list">

                    <h2>
                        📚 Course Lessons
                    </h2>

                    {!course.lessons ||
                        course.lessons.length === 0 ? (

                        <p>
                            No lessons available
                            for this course yet.
                        </p>

                    ) : (

                        course.lessons.map(
                            (lesson, index) => {

                                const completed =
                                    isLessonCompleted(
                                        lesson._id
                                    );

                                return (
                                    <div
                                        className="lesson-item"
                                        key={
                                            lesson._id ||
                                            index
                                        }
                                    >

                                        <h3>
                                            Lesson{" "}
                                            {index + 1}:{" "}
                                            {lesson.title}
                                        </h3>

                                        <p>
                                            <strong>
                                                Duration:
                                            </strong>{" "}
                                            {lesson.duration}
                                        </p>

                                        <div className="lesson-actions">

                                            {/* Watch */}

                                            <a
                                                href={
                                                    lesson.videoUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-btn"
                                            >
                                                ▶ Watch Lesson
                                            </a>

                                            {/* Complete */}

                                            {!enrollment ? (

                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() =>
                                                        setMessage(
                                                            "Please enroll in this course first"
                                                        )
                                                    }
                                                >
                                                    🔒 Enroll to Complete
                                                </button>

                                            ) : completed ? (

                                                <button
                                                    type="button"
                                                    className="completed-btn"
                                                    disabled
                                                >
                                                    ✅ Lesson Completed
                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() =>
                                                        handleCompleteLesson(
                                                            lesson._id
                                                        )
                                                    }
                                                >
                                                    ✅ Mark as Completed
                                                </button>

                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

                {/* Message */}

                {message && (
                    <p className="enrollment-message">
                        {message}
                    </p>
                )}

                {/* Enrollment */}

                {!enrollment && (
                    <div className="enrollment-form">

                        <h2>
                            Enroll in this Course
                        </h2>

                        <label>
                            Student Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={studentName}
                            onChange={(e) =>
                                setStudentName(
                                    e.target.value
                                )
                            }
                            readOnly={
                                userLoggedIn
                            }
                        />

                        <label>
                            Student Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={studentEmail}
                            onChange={(e) =>
                                setStudentEmail(
                                    e.target.value
                                )
                            }
                            readOnly={
                                userLoggedIn
                            }
                        />

                        {userLoggedIn && (
                            <p>
                                Logged in as{" "}
                                <strong>
                                    {studentName}
                                </strong>
                            </p>
                        )}

                        <button
                            type="button"
                            className="view-btn"
                            onClick={
                                handleEnroll
                            }
                        >
                            Enroll Now
                        </button>

                    </div>
                )}

                {/* Average Rating */}

                <div className="rating-summary">

                    <h2>
                        ⭐ {averageRating} / 5
                    </h2>

                    <p>
                        Based on{" "}
                        {reviews.length}{" "}
                        review
                        {reviews.length !== 1
                            ? "s"
                            : ""}
                    </p>

                </div>

                {/* Review Form */}

                <div className="review-section">

                    <h2>
                        ⭐ Rate This Course
                    </h2>

                    <form
                        onSubmit={
                            handleReviewSubmit
                        }
                    >

                        <label>
                            Rating
                        </label>

                        <select
                            value={rating}
                            onChange={(e) =>
                                setRating(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        >

                            <option value="5">
                                ⭐⭐⭐⭐⭐ — 5
                            </option>

                            <option value="4">
                                ⭐⭐⭐⭐ — 4
                            </option>

                            <option value="3">
                                ⭐⭐⭐ — 3
                            </option>

                            <option value="2">
                                ⭐⭐ — 2
                            </option>

                            <option value="1">
                                ⭐ — 1
                            </option>

                        </select>

                        <label>
                            Your Review
                        </label>

                        <textarea
                            placeholder="Write your review..."
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            rows="4"
                        />

                        <button
                            type="submit"
                            className="view-btn"
                        >
                            Submit Review
                        </button>

                    </form>

                    {reviewMessage && (
                        <p className="enrollment-message">
                            {reviewMessage}
                        </p>
                    )}

                </div>

                {/* Student Reviews */}

                <div className="reviews-list">

                    <h2>
                        Student Reviews
                    </h2>

                    {reviews.length === 0 ? (

                        <p>
                            No reviews yet.
                            Be the first to
                            review this course!
                        </p>

                    ) : (

                        reviews.map(
                            (review) => (

                                <div
                                    className="review-card"
                                    key={
                                        review._id
                                    }
                                >

                                    <h3>
                                        {
                                            review.studentName
                                        }
                                    </h3>

                                    <p>
                                        {"⭐".repeat(
                                            Number(
                                                review.rating
                                            )
                                        )}
                                    </p>

                                    <p>
                                        {
                                            review.comment
                                        }
                                    </p>

                                    <small>
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </small>

                                </div>
                            )
                        )
                    )}

                </div>

            </div>

        </div>
    );
}

export default CourseDetails;