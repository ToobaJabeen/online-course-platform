
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyEnrollments() {
    const [enrollments, setEnrollments] = useState([]);

    // ==========================================
    // Cancel Enrollment
    // ==========================================
    const handleCancel = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this enrollment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:3000/api/enrollments/${id}`
            );

            alert(response.data.message);

            setEnrollments((currentEnrollments) =>
                currentEnrollments.filter(
                    (enrollment) =>
                        enrollment._id !== id
                )
            );
        } catch (error) {
            console.log(
                "Cancel enrollment error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to cancel enrollment"
            );
        }
    };

    // ==========================================
    // Update Progress
    // ==========================================
    const handleProgressChange = async (
        enrollmentId,
        progress
    ) => {
        try {
            const progressValue = Number(progress);

            const response = await axios.put(
                `http://localhost:3000/api/enrollments/${enrollmentId}/progress`,
                {
                    progress: progressValue,
                }
            );

            setEnrollments((currentEnrollments) =>
                currentEnrollments.map(
                    (enrollment) =>
                        enrollment._id === enrollmentId
                            ? response.data.enrollment
                            : enrollment
                )
            );
        } catch (error) {
            console.log(
                "Progress update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update progress"
            );
        }
    };

    // ==========================================
    // Load User Enrollments
    // ==========================================
    useEffect(() => {
        const loadEnrollments = async () => {
            try {
                const savedUser =
                    localStorage.getItem("user");

                if (!savedUser) {
                    setEnrollments([]);
                    return;
                }

                const user = JSON.parse(savedUser);

                if (!user?.email) {
                    setEnrollments([]);
                    return;
                }

                const response = await axios.get(
                    "http://localhost:3000/api/enrollments",
                    {
                        params: {
                            email: user.email,
                        },
                    }
                );

                setEnrollments(
                    response.data.enrollments || []
                );
            } catch (error) {
                console.log(
                    "Fetch enrollments error:",
                    error
                );

                setEnrollments([]);
            }
        };

        loadEnrollments();
    }, []);

    return (
        <div className="container">

            <h1 className="title">
                My Enrollments
            </h1>

            {enrollments.length === 0 ? (
                <div className="empty-state">

                    <div className="empty-icon">
                        📚
                    </div>

                    <h2>
                        No Enrollments Yet
                    </h2>

                    <p>
                        You haven't enrolled in any
                        course yet. Explore our courses
                        and start learning today!
                    </p>

                    <Link
                        to="/"
                        className="browse-courses-btn"
                    >
                        Browse Courses
                    </Link>

                </div>
            ) : (
                <div className="enrollment-grid">

                    {enrollments.map((enrollment) => {

                        const progress = Math.min(
                            100,
                            Math.max(
                                0,
                                Number(
                                    enrollment.progress || 0
                                )
                            )
                        );

                        const completed =
                            progress === 100;

                        return (
                            <div
                                className="enrollment-card"
                                key={enrollment._id}
                            >

                                <h2>
                                    {enrollment.course?.title ||
                                        "Course"}
                                </h2>

                                <p>
                                    <strong>
                                        Student:
                                    </strong>{" "}
                                    {enrollment.studentName}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {enrollment.studentEmail}
                                </p>

                                <p>
                                    <strong>
                                        Price:
                                    </strong>{" "}
                                    Rs.{" "}
                                    {enrollment.course?.price}
                                </p>

                                <p>
                                    <strong>
                                        Instructor:
                                    </strong>{" "}
                                    {enrollment.course?.instructor}
                                </p>

                                <p>
                                    <strong>
                                        Enrolled:
                                    </strong>{" "}
                                    {new Date(
                                        enrollment.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                {/* Progress */}

                                <div className="progress-section">

                                    <div className="progress-header">

                                        <strong>
                                            Course Progress
                                        </strong>

                                        <span>
                                            {progress}%
                                        </span>

                                    </div>

                                    <div className="progress-bar">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width:
                                                    `${progress}%`,
                                            }}
                                        />

                                    </div>

                                    {completed ? (
                                        <div className="completion-message">
                                            🎉 Course Completed!
                                        </div>
                                    ) : (
                                        <div className="progress-status">
                                            📚 In Progress
                                        </div>
                                    )}

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="10"
                                        value={progress}
                                        onChange={(e) =>
                                            handleProgressChange(
                                                enrollment._id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    <small>
                                        Drag the slider to
                                        update your course
                                        progress.
                                    </small>

                                </div>

                                {/* Course */}

                                <Link
                                    to={`/course/${enrollment.course?._id}`}
                                    className="view-btn"
                                >
                                    View Course
                                </Link>

                                {/* Cancel */}

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        handleCancel(
                                            enrollment._id
                                        )
                                    }
                                >
                                    Cancel Enrollment
                                </button>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default MyEnrollments;
