import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import "./App.css";

import Navbar from "./Navbar";
import Home from "./Home";
import CourseDetails from "./CourseDetails";
import MyEnrollments from "./MyEnrollments";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
    let user = null;

    try {
        const savedUser =
            localStorage.getItem("user");

        if (savedUser) {
            user = JSON.parse(savedUser);
        }
    } catch (error) {
        console.log(
            "User data error:",
            error
        );

        user = null;
    }

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    Home
                ========================= */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* =========================
                    Course Details
                ========================= */}
                <Route
                    path="/course/:id"
                    element={<CourseDetails />}
                />

                {/* =========================
                    My Enrollments
                ========================= */}
                <Route
                    path="/my-enrollments"
                    element={<MyEnrollments />}
                />

                {/* =========================
                    Signup
                ========================= */}
                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* =========================
                    Login
                ========================= */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* =========================
                    Student Dashboard
                ========================= */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* =========================
                    Admin Dashboard
                ========================= */}
                <Route
                    path="/admin"
                    element={
                        user?.role === "admin" ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                    }
                />

                {/* =========================
                    Invalid URL
                ========================= */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;