const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const router = express.Router();

// ===============================
// PLACEMENT DASHBOARD
// GET /api/dashboard/stats
// ===============================
router.get("/stats", async (req, res) => {
    try {
        // Total students
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        // Total jobs
        const totalJobs = await Job.countDocuments();

        // Total applications
        const totalApplications = await Application.countDocuments();

        // Selected applications
        const selectedApplications = await Application.countDocuments({
            status: "selected"
        });

        // Shortlisted applications
        const shortlistedApplications = await Application.countDocuments({
            status: "shortlisted"
        });

        // Rejected applications
        const rejectedApplications = await Application.countDocuments({
            status: "rejected"
        });

        // Applied applications
        const appliedApplications = await Application.countDocuments({
            status: "applied"
        });

        // Average AI Match Score
        const scoreData = await Application.aggregate([
            {
                $group: {
                    _id: null,
                    averageScore: {
                        $avg: "$aiMatchScore"
                    }
                }
            }
        ]);

        const averageMatchScore =
            scoreData.length > 0
                ? Math.round(scoreData[0].averageScore)
                : 0;

        res.status(200).json({
            message: "Dashboard statistics fetched successfully",

            statistics: {
                totalStudents,
                totalJobs,
                totalApplications,
                averageMatchScore,
                appliedApplications,
                shortlistedApplications,
                selectedApplications,
                rejectedApplications
            }
        });

    } catch (error) {
        console.log("DASHBOARD ERROR =", error);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
});

module.exports = router;