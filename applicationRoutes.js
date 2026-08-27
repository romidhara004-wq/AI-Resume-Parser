 const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");

const router = express.Router();

// ===============================
// APPLY FOR JOB / INTERNSHIP
// ===============================
router.post("/apply", async (req, res) => {
    try {
        console.log("APPLICATION BODY =", req.body);

        const {
            studentId,
            studentName,
            studentEmail,
            jobId
        } = req.body;

        // REQUIRED FIELD CHECK
        if (!studentId || !studentName || !studentEmail || !jobId) {
            return res.status(400).json({
                message: "Student ID, name, email and Job ID are required"
            });
        }

        // FIND JOB
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // ===============================
        // DUPLICATE APPLICATION CHECK
        // ===============================
        const existingApplication = await Application.findOne({
            studentId: studentId,
            roleApplied: job.roleTitle
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job"
            });
        }

        // ===============================
        // CREATE APPLICATION
        // ===============================
        const application = await Application.create({
            studentId: studentId,
            studentName: studentName,
            studentEmail: studentEmail,
            roleApplied: job.roleTitle,
            companyName: job.companyName,
            aiMatchScore: 0,
            status: "applied"
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.log("APPLICATION ERROR =", error);

        res.status(500).json({
            message: "Failed to submit application",
            error: error.message
        });
    }
});


// ===============================
// GET ALL APPLICATIONS
// ===============================
router.get("/", async (req, res) => {
    try {
        const applications = await Application.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.log("GET APPLICATIONS ERROR =", error);

        res.status(500).json({
            message: "Failed to get applications",
            error: error.message
        });
    }
});


// ===============================
// GET STUDENT APPLICATIONS
// ===============================
router.get("/student/:studentId", async (req, res) => {
    try {
        const applications = await Application.find({
            studentId: req.params.studentId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.log("STUDENT APPLICATION ERROR =", error);

        res.status(500).json({
            message: "Failed to get student applications",
            error: error.message
        });
    }
});


// ===============================
// GET APPLICATIONS FOR A JOB
// ===============================
router.get("/job/:jobId", async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const applications = await Application.find({
            roleApplied: job.roleTitle
        }).sort({ aiMatchScore: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.log("JOB APPLICATION ERROR =", error);

        res.status(500).json({
            message: "Failed to get job applications",
            error: error.message
        });
    }
});


// ===============================
// GET APPLICATION BY ID
// ===============================
router.get("/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            application
        });

    } catch (error) {
        console.log("SINGLE APPLICATION ERROR =", error);

        res.status(500).json({
            message: "Failed to get application",
            error: error.message
        });
    }
});


// ===============================
// UPDATE APPLICATION STATUS
// ===============================
router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = [
            "applied",
            "shortlisted",
            "rejected",
            "selected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            {
                status: status
            },
            {
                new: true
            }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.log("STATUS UPDATE ERROR =", error);

        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
});


module.exports = router;