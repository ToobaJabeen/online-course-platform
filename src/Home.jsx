
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [level, setLevel] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/courses")
            .then((response) => {
                setCourses(response.data.courses || []);
            })
            .catch((error) => {
                console.log("Courses error:", error);
            });
    }, []);

    const categories = [
        "All",
        ...new Set(
            courses
                .map((course) => course.category)
                .filter(Boolean)
        ),
    ];

    const levels = [
        "All",
        "Beginner",
        "Intermediate",
        "Advanced",
    ];

    const filteredCourses = courses.filter((course) => {
        const searchText = search
            .toLowerCase()
            .trim();

        const matchesSearch =
            !searchText ||
            course.title
                ?.toLowerCase()
                .includes(searchText) ||
            course.description
                ?.toLowerCase()
                .includes(searchText) ||
            course.instructor
                ?.toLowerCase()
                .includes(searchText);

        const matchesCategory =
            category === "All" ||
            course.category === category;

        const matchesLevel =
            level === "All" ||
            course.level === level;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesLevel
        );
    });

    const sortedCourses = [...filteredCourses].sort(
        (a, b) => {
            if (sortBy === "price-low") {
                return a.price - b.price;
            }

            if (sortBy === "price-high") {
                return b.price - a.price;
            }

            if (sortBy === "name") {
                return a.title.localeCompare(b.title);
            }

            if (sortBy === "newest") {
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            }

            return 0;
        }
    );

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setLevel("All");
        setSortBy("newest");
    };

    return (
        <div className="container">

            <h1 className="title">
                Explore Our Courses
            </h1>

            <div className="course-filters">

                <input
                    type="text"
                    placeholder="Search by course or instructor..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-input"
                />

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >
                    {categories.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item === "All"
                                ? "All Categories"
                                : item}
                        </option>
                    ))}
                </select>

                <select
                    value={level}
                    onChange={(e) =>
                        setLevel(e.target.value)
                    }
                >
                    {levels.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item === "All"
                                ? "All Levels"
                                : item}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >
                    <option value="newest">
                        Newest
                    </option>

                    <option value="price-low">
                        Price: Low to High
                    </option>

                    <option value="price-high">
                        Price: High to Low
                    </option>

                    <option value="name">
                        Name: A to Z
                    </option>
                </select>

                <button
                    className="reset-btn"
                    onClick={resetFilters}
                >
                    Reset Filters
                </button>

            </div>

            <div className="course-count">
                {sortedCourses.length} course(s) found
            </div>

            {sortedCourses.length === 0 ? (
                <div className="empty-state">

                    <div className="empty-icon">
                        🔍
                    </div>

                    <h2>No Courses Found</h2>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button
                        className="view-btn"
                        onClick={resetFilters}
                    >
                        Clear Filters
                    </button>

                </div>
            ) : (
                <div className="course-grid">

                    {sortedCourses.map((course) => (
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
                                    Category:
                                </strong>{" "}
                                {course.category}
                            </p>

                            <p>
                                <strong>
                                    Level:
                                </strong>{" "}
                                {course.level}
                            </p>

                            <p>
                                <strong>
                                    Instructor:
                                </strong>{" "}
                                {course.instructor}
                            </p>

                            <h3>
                                Rs. {course.price}
                            </h3>

                            <Link
                                to={`/course/${course._id}`}
                                className="view-btn"
                            >
                                View Course
                            </Link>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Home;

