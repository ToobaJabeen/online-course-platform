import { useState } from "react";
import axios from "axios";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/signup",
                {
                    name,
                    email,
                    password,
                }
            );

            setMessage(response.data.message);

            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Signup failed"
            );
        }
    };

    return (
        <div className="container">
            <div className="course-details-card">
                <h1>Create Account</h1>

                <form onSubmit={handleSignup}>
                    <div className="enrollment-form">

                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="view-btn"
                        >
                            Sign Up
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

export default Signup;