 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const matchRoutes = require("./routes/matchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config({
    path: __dirname + "/.env"
});

console.log(
    "Mongo URI loaded:",
    process.env.MONGO_URI ? "YES ✅" : "NO ❌"
);

const app = express();

// ===============================
// CORS
// ===============================
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ===============================
// JSON
// ===============================
app.use(express.json());

// ===============================
// FRONTEND FILE HANDLER
// Supports both:
// 1. Local: backend/public/*.html
// 2. Render/GitHub: root/*.html
// ===============================

const frontendFiles = [
    "index.html",
    "login.html",
    "register.html",
    "jobs.html",
    "application.html",
    "student-dashboard.html",
    "student-profile.html",
    "company-dashboard.html",
    "recruiter.html"
];

function sendFrontendFile(fileName, req, res) {

    const rootFile = path.join(__dirname, fileName);

    const publicFile = path.join(
        __dirname,
        "public",
        fileName
    );

    // First check root
    if (fs.existsSync(rootFile)) {
        return res.sendFile(rootFile);
    }

    // Then check public folder
    if (fs.existsSync(publicFile)) {
        return res.sendFile(publicFile);
    }

    return res.status(404).send("Page not found");
}

// Create routes for frontend pages
frontendFiles.forEach((fileName) => {

    const route = fileName === "index.html"
        ? "/"
        : `/${fileName}`;

    app.get(route, (req, res) => {
        sendFrontendFile(fileName, req, res);
    });
});

// Also allow /index.html
app.get("/index.html", (req, res) => {
    sendFrontendFile("index.html", req, res);
});

// ===============================
// DATABASE CONNECTION
// ===============================
connectDB();

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/match", matchRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
