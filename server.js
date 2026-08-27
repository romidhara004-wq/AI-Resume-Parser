const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // <-- Yeh add kiya

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
// MIDDLEWARE (CORS Updated)
// ===============================
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// ===============================
// STATIC FOLDER (Frontend ke liye)
// ===============================
app.use(express.static(path.join(__dirname, 'public'))); // <-- Yeh line yahan daal do

// ===============================
// DATABASE CONNECTION
// ===============================
connectDB();

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "SkillBridge AI Backend is Running 🚀"
    });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});