
const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Routes
// ==========================================

app.use("/api/courses", courseRoutes);

app.use(
    "/api/enrollments",
    enrollmentRoutes
);

app.use(
    "/api/reviews",
    reviewRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "Online Course Platform API is running",
    });
});

// ==========================================
// Database
// ==========================================

connectDB();

// ==========================================
// Server
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server is running on port http://localhost:${PORT}`
    );
});
