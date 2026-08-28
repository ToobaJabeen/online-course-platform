const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// Signup
// ==========================================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: cleanEmail,
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password,
            role: "student",
        });

        res.status(201).json({
            message: "Signup successful",
            user,
        });
    } catch (error) {
        console.log("Signup error:", error);

        res.status(500).json({
            message: "Signup failed",
            error: error.message,
        });
    }
});

// ==========================================
// Login
// ==========================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password",
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: cleanEmail,
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        res.status(200).json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        console.log("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});

module.exports = router;
