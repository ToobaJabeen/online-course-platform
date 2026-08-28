import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            console.log("Login response:", response.data);

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage(response.data.message);

            setEmail("");
            setPassword("");

        } catch (error) {
            console.log("Login error:", error);

            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="container">
            <div className="course-details-card">
                <h1>Login</h1>

                <form onSubmit={handleLogin}>
                    <div className="enrollment-form">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="view-btn"
                        >
                            Login
                        </button>

                        {message && (
                            <p className="enrollment-message">
                                {message}
                            </p>
                        )}

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;