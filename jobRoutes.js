 const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// ===============================
// CREATE JOB / INTERNSHIP
// ===============================
router.post("/create", async (req, res) => {
    try {
        console.log("JOB BODY =", req.body);

        const {
            roleTitle,
            description,
            companyName,
            type,
            requiredSkills,
            location,
            salary,
            deadline
        } = req.body;

        const job = await Job.create({
            roleTitle,
            description,
            companyName,
            type,
            requiredSkills,
            location,
            salary,
            deadline
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.log("JOB ERROR =", error);

        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
});


// ===============================
// GET ALL JOBS
// ===============================
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.log("GET JOB ERROR =", error);

        res.status(500).json({
            message: "Failed to get jobs",
            error: error.message
        });
    }
});


// ===============================
// GET SINGLE JOB
// ===============================
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            job
        });

    } catch (error) {
        console.log("SINGLE JOB ERROR =", error);

        res.status(500).json({
            message: "Failed to get job",
            error: error.message
        });
    }
});


// ===============================
// CLOSE JOB
// ===============================
router.put("/:id/close", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: "closed" },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job closed successfully",
            job
        });

    } catch (error) {
        console.log("CLOSE JOB ERROR =", error);

        res.status(500).json({
            message: "Failed to close job",
            error: error.message
        });
    }
});


module.exports = router;