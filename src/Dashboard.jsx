import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
    const [enrollments, setEnrollments] = useState([]);
    const [reviews, setReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // Load Dashboard Data
    // ==========================================
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const savedUser =
                    localStorage.getItem("user");

                if (!savedUser) {
                    setEnrollments([]);
                    setReviews(0);
                    return;
                }

                let user;

                try {
                    user = JSON.parse(savedUser);
                } catch (error) {
                    console.log(
                        "Invalid user data:",
                        error
                    );

                    setEnrollments([]);
                    setReviews(0);
                    return;
                }

                if (!user?.email) {
                    setEnrollments([]);
                    setReviews(0);
                    return;
                }

                const email =
                    user.email
                        .trim()
                        .toLowerCase();

                // ==========================================
                // Get Student Enrollments
                // ==========================================
                const enrollmentResponse =
                    await axios.get(
                        "http://localhost:3000/api/enrollments",
                        {
                            params: {
                                email: email,
                            },
                        }
                    );

                const userEnrollments =
                    enrollmentResponse.data
                        .enrollments || [];

                setEnrollments(userEnrollments);

                // ==========================================
                // Get Student Reviews
                // ==========================================

                let reviewCount = 0;

                // Unique course IDs
                const courseIds = [
                    ...new Set(
                        userEnrollments
                            .map(
                                (enrollment) =>
                                    enrollment.course?._id
                            )
                            .filter(Boolean)
                    ),
                ];

                for (const courseId of courseIds) {
                    try {
                        const response =
                            await axios.get(
                                `http://localhost:3000/api/reviews/${courseId}`
                            );

                        const courseReviews =
                            response.data.reviews ||
                            [];

                        const userReviews =
                            courseReviews.filter(
                                (review) =>
                                    review.studentEmail
                                        ?.trim()
                                        .toLowerCase() ===
                                    email
                            );

                        reviewCount +=
                            userReviews.length;

                    } catch (error) {
                        console.log(
                            "Review fetch error:",
                            error
                        );
                    }
                }

                setReviews(reviewCount);

            } catch (error) {
                console.log(
                    "Dashboard error:",
                    error
                );

                setEnrollments([]);
                setReviews(0);

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // ==========================================
    // Statistics
    // ==========================================

    const totalCourses =
        enrollments.length;

    const completedCourses =
        enrollments.filter(
            (enrollment) =>
                Number(
                    enrollment.progress || 0
                ) === 100
        ).length;

    const overallProgress =
        totalCourses > 0
            ? Math.round(
                enrollments.reduce(
                    (
                        total,
                        enrollment
                    ) =>
                        total +
                        Number(
                            enrollment.progress || 0
                        ),
                    0
                ) / totalCourses
            )
            : 0;

    // ==========================================
    // Loading
    // ==========================================

    if (loading) {
        return (
            <div className="container">
                <h2>
                    Loading Dashboard...
                </h2>
            </div>
        );
    }

    // ==========================================
    // Dashboard UI
    // ==========================================

    return (
        <div className="container">

            <h1 className="title">
                Student Dashboard
            </h1>

            {/* ==========================================
                Statistics
            ========================================== */}

            <div className="dashboard-grid">

                {/* Total Enrollments */}

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        📚
                    </div>

                    <h2>
                        {totalCourses}
                    </h2>

                    <p>
                        Total Enrollments
                    </p>

                </div>

                {/* Completed Courses */}

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        ✅
                    </div>

                    <h2>
                        {completedCourses}
                    </h2>

                    <p>
                        Completed Courses
                    </p>

                </div>

                {/* Overall Progress */}

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        📈
                    </div>

                    <h2>
                        {overallProgress}%
                    </h2>

                    <p>
                        Overall Progress
                    </p>

                </div>

                {/* Reviews */}

                <div className="dashboard-card">

                    <div className="dashboard-icon">
                        ⭐
                    </div>

                    <h2>
                        {reviews}
                    </h2>

                    <p>
                        Reviews Given
                    </p>

                </div>

            </div>

            {/* ==========================================
                Dashboard Buttons
            ========================================== */}

            <div className="dashboard-actions">

                <Link
                    to="/"
                    className="view-btn"
                >
                    Browse Courses
                </Link>

                <Link
                    to="/my-enrollments"
                    className="view-btn"
                >
                    My Enrollments
                </Link>

            </div>

        </div>
    );
}

export default Dashboard;