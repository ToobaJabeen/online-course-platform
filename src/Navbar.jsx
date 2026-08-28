
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const savedUser =
                localStorage.getItem("user");

            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.log(
                        "User data error:",
                        error
                    );

                    localStorage.removeItem("user");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        loadUser();

        window.addEventListener(
            "storage",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadUser
            );
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="nav-container">

                <Link
                    to="/"
                    className="logo"
                >
                    Online Course Platform
                </Link>

                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    {user && (
                        <>
                            <Link to="/my-enrollments">
                                My Enrollments
                            </Link>

                            <Link to="/dashboard">
                                Dashboard
                            </Link>

                            {user.role === "admin" && (
                                <Link to="/admin">
                                    Admin
                                </Link>
                            )}
                        </>
                    )}

                    {!user ? (
                        <>
                            <Link to="/signup">
                                Sign Up
                            </Link>

                            <Link to="/login">
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="welcome-user">
                                Welcome,{" "}
                                {user.name}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="view-btn"
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
