import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
    const emptyForm = {
        title: "",
        description: "",
        price: "",
        level: "Beginner",
        category: "",
        instructor: "",
    };

    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");

    // ==========================================
    // Lesson Form
    // ==========================================

    const [lessonForm, setLessonForm] = useState({
        title: "",
        videoUrl: "",
        duration: "",
    });

    // ==========================================
    // Lessons
    // ==========================================

    const [lessons, setLessons] = useState([]);

    // ==========================================
    // Load Courses
    // ==========================================

    const loadCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/courses"
            );

            setCourses(response.data.courses || []);
        } catch (error) {
            console.log("Courses error:", error);
        }
    };

    // ==========================================
    // Load Enrollments
    // ==========================================

    const loadEnrollments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/enrollments/admin/all"
            );

            setEnrollments(
                response.data.enrollments || []
            );
        } catch (error) {
            console.log(
                "Enrollments error:",
                error
            );

            setEnrollments([]);
        }
    };

    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {
        loadCourses();
        loadEnrollments();
    }, []);

    // ==========================================
    // Course Form Change
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    // ==========================================
    // Add / Update Course
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const courseData = {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                level: form.level,
                category: form.category,
                instructor: form.instructor,
                lessons: lessons,
            };

            if (editingId) {
                const response = await axios.put(
                    `http://localhost:3000/api/courses/${editingId}`,
                    courseData
                );

                setMessage(response.data.message);
            } else {
                const response = await axios.post(
                    "http://localhost:3000/api/courses",
                    courseData
                );

                setMessage(response.data.message);
            }

            // Reset course form
            setForm(emptyForm);

            // Reset lessons
            setLessons([]);

            // Reset lesson form
            setLessonForm({
                title: "",
                videoUrl: "",
                duration: "",
            });

            // Exit edit mode
            setEditingId(null);

            // Reload courses
            await loadCourses();

        } catch (error) {
            console.log(
                "Course save error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to save course"
            );
        }
    };

    // ==========================================
    // Edit Course
    // ==========================================

    const handleEdit = (course) => {
        setEditingId(course._id);

        setForm({
            title: course.title || "",
            description: course.description || "",
            price: course.price || "",
            level: course.level || "Beginner",
            category: course.category || "",
            instructor: course.instructor || "",
        });

        // Existing lessons load
        setLessons(course.lessons || []);

        setLessonForm({
            title: "",
            videoUrl: "",
            duration: "",
        });

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // Delete Course
    // ==========================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:3000/api/courses/${id}`
            );

            setMessage(response.data.message);

            await loadCourses();

        } catch (error) {
            console.log(
                "Delete course error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete course"
            );
        }
    };

    // ==========================================
    // Add Lesson
    // ==========================================

    const handleAddLesson = () => {
        if (
            !lessonForm.title.trim() ||
            !lessonForm.videoUrl.trim()
        ) {
            setMessage(
                "Please provide lesson title and video URL"
            );

            return;
        }

        const newLesson = {
            title: lessonForm.title.trim(),
            videoUrl: lessonForm.videoUrl.trim(),
            duration:
                lessonForm.duration.trim() || "0",
        };

        setLessons((currentLessons) => [
            ...currentLessons,
            newLesson,
        ]);

        setLessonForm({
            title: "",
            videoUrl: "",
            duration: "",
        });

        setMessage(
            "Lesson added successfully"
        );
    };

    // ==========================================
    // Delete Lesson
    // ==========================================

    const handleDeleteLesson = (index) => {
        setLessons((currentLessons) =>
            currentLessons.filter(
                (_, lessonIndex) =>
                    lessonIndex !== index
            )
        );

        setMessage(
            "Lesson removed successfully"
        );
    };

    // ==========================================
    // Update Enrollment Progress
    // ==========================================

    const handleProgressUpdate = async (
        id,
        progress
    ) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/enrollments/${id}/progress`,
                {
                    progress: Number(progress),
                }
            );

            setMessage(response.data.message);

            await loadEnrollments();

        } catch (error) {
            console.log(
                "Progress update error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to update progress"
            );
        }
    };

    // ==========================================
    // Cancel Edit
    // ==========================================

    const handleCancelEdit = () => {
        setEditingId(null);

        setForm(emptyForm);

        setLessons([]);

        setLessonForm({
            title: "",
            videoUrl: "",
            duration: "",
        });

        setMessage("");
    };

    // ==========================================
    // Completed Courses Count
    // ==========================================

    const completedCourses = enrollments.filter(
        (enrollment) =>
            Number(enrollment.progress || 0) === 100
    ).length;

    // ==========================================
    // RETURN
    // ==========================================

    return (
        <div className="container">

            {/* ==========================================
                Dashboard Title
            ========================================== */}

            <h1 className="title">
                Admin Dashboard
            </h1>

            {/* ==========================================
                Statistics
            ========================================== */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        📚
                    </div>

                    <h2>
                        {courses.length}
                    </h2>

                    <p>
                        Total Courses
                    </p>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        👨‍🎓
                    </div>

                    <h2>
                        {enrollments.length}
                    </h2>

                    <p>
                        Total Enrollments
                    </p>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        ✅
                    </div>

                    <h2>
                        {completedCourses}
                    </h2>

                    <p>
                        Completed Courses
                    </p>

                </div>

            </div>

            {/* ==========================================
                Add / Edit Course
            ========================================== */}

            <div className="course-details-card">

                <h2>
                    {editingId
                        ? "Edit Course"
                        : "Add New Course"}
                </h2>

                <form
                    className="enrollment-form"
                    onSubmit={handleSubmit}
                >

                    {/* Course Title */}

                    <label>
                        Course Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter course title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    {/* Description */}

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        placeholder="Enter course description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />

                    {/* Price */}

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                    {/* Level */}

                    <label>
                        Level
                    </label>

                    <select
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                    >

                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>

                        <option value="Advanced">
                            Advanced
                        </option>

                    </select>

                    {/* Category */}

                    <label>
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        placeholder="e.g. Web Development"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />

                    {/* Instructor */}

                    <label>
                        Instructor
                    </label>

                    <input
                        type="text"
                        name="instructor"
                        placeholder="Enter instructor name"
                        value={form.instructor}
                        onChange={handleChange}
                        required
                    />

                    {/* ==========================================
                        Lesson Section
                    ========================================== */}

                    <h3>
                        Add Course Lesson
                    </h3>

                    {/* Lesson Title */}

                    <label>
                        Lesson Title
                    </label>

                    <input
                        type="text"
                        placeholder="Enter lesson title"
                        value={lessonForm.title}
                        onChange={(e) =>
                            setLessonForm({
                                ...lessonForm,
                                title: e.target.value,
                            })
                        }
                    />

                    {/* Video URL */}

                    <label>
                        Video URL
                    </label>

                    <input
                        type="text"
                        placeholder="Enter video URL"
                        value={lessonForm.videoUrl}
                        onChange={(e) =>
                            setLessonForm({
                                ...lessonForm,
                                videoUrl: e.target.value,
                            })
                        }
                    />

                    {/* Duration */}

                    <label>
                        Duration
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. 10:30"
                        value={lessonForm.duration}
                        onChange={(e) =>
                            setLessonForm({
                                ...lessonForm,
                                duration: e.target.value,
                            })
                        }
                    />

                    {/* Add Lesson */}

                    <button
                        type="button"
                        className="view-btn"
                        onClick={handleAddLesson}
                    >
                        Add Lesson
                    </button>

                    {/* ==========================================
                        Lessons List
                    ========================================== */}

                    {lessons.length > 0 && (

                        <div className="lessons-list">

                            <h3>
                                Course Lessons
                            </h3>

                            {lessons.map(
                                (lesson, index) => (

                                    <div
                                        className="lesson-item"
                                        key={index}
                                    >

                                        <h4>
                                            Lesson {index + 1}:{" "}
                                            {lesson.title}
                                        </h4>

                                        <p>
                                            <strong>
                                                Duration:
                                            </strong>{" "}
                                            {lesson.duration}
                                        </p>

                                        <p>
                                            <strong>
                                                Video:
                                            </strong>{" "}
                                            {lesson.videoUrl}
                                        </p>

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() =>
                                                handleDeleteLesson(
                                                    index
                                                )
                                            }
                                        >
                                            Remove Lesson
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                    {/* ==========================================
                        Save Course
                    ========================================== */}

                    <button
                        type="submit"
                        className="view-btn"
                    >
                        {editingId
                            ? "Update Course"
                            : "Add Course"}
                    </button>

                    {/* Cancel */}

                    {editingId && (

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                        >
                            Cancel Edit
                        </button>

                    )}

                    {/* Message */}

                    {message && (

                        <p className="enrollment-message">
                            {message}
                        </p>

                    )}

                </form>

            </div>

            {/* ==========================================
                All Courses
            ========================================== */}

            <h2 className="title">
                All Courses
            </h2>

            {courses.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        📚
                    </div>

                    <h2>
                        No Courses Yet
                    </h2>

                    <p>
                        Add your first course
                        using the form above.
                    </p>

                </div>

            ) : (

                <div className="course-grid">

                    {courses.map((course) => (

                        <div
                            className="course-card"
                            key={course._id}
                        >

                            <h2>
                                {course.title}
                            </h2>

                            <p>
                                {course.description}
                            </p>

                            <p>
                                <strong>
                                    Price:
                                </strong>{" "}
                                Rs. {course.price}
                            </p>

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
                                {course.lessons?.length || 0}
                            </p>

                            <div className="dashboard-actions">

                                <button
                                    className="view-btn"
                                    onClick={() =>
                                        handleEdit(course)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        handleDelete(
                                            course._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* ==========================================
                All Enrollments
            ========================================== */}

            <h2 className="title">
                All Enrollments
            </h2>

            {enrollments.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        👨‍🎓
                    </div>

                    <h2>
                        No Enrollments Yet
                    </h2>

                    <p>
                        No student has enrolled in
                        any course yet.
                    </p>

                </div>

            ) : (

                <div className="enrollment-grid">

                    {enrollments.map(
                        (enrollment) => {

                            const progress =
                                Number(
                                    enrollment.progress || 0
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
                                            Instructor:
                                        </strong>{" "}
                                        {enrollment.course?.instructor ||
                                            "N/A"}
                                    </p>

                                    <p>
                                        <strong>
                                            Price:
                                        </strong>{" "}
                                        Rs.{" "}
                                        {enrollment.course?.price ||
                                            0}
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
                                                    width: `${progress}%`,
                                                }}
                                            ></div>

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

                                        <select
                                            value={progress}
                                            onChange={(e) =>
                                                handleProgressUpdate(
                                                    enrollment._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="0">
                                                0%
                                            </option>

                                            <option value="25">
                                                25%
                                            </option>

                                            <option value="50">
                                                50%
                                            </option>

                                            <option value="75">
                                                75%
                                            </option>

                                            <option value="100">
                                                100%
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
}

export default AdminDashboard;