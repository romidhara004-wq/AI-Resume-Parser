const express = require("express");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const axios = require("axios"); 
const fs = require("fs");
const FormData = require("form-data");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

console.log("✅ MATCH ROUTES LOADED");

// 🌟 Naya route jo dashboard se direct resume file receive karega aur Python AI server par bhejega
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));
        formData.append("job_description", "General Software Engineering and AI Role");

        const pythonResponse = await axios.post("http://localhost:8000/parse", formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Temporary file delete kar do
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "Resume parsed successfully by AI",
            aiData: pythonResponse.data
        });

    } catch (error) {
        console.log("Upload & Parse Error =", error.message);
        res.status(500).json({ message: "Failed to parse resume", error: error.message });
    }
});

// Purana ID-based route
router.post("/:jobId/:studentId", async (req, res) => {
    try {
        const { jobId, studentId } = req.params;

        const job = await Job.findById(jobId);
        const student = await User.findById(studentId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        let aiParsedData = {};
        try {
            const resumePath = student.resumePath || "./sample_resume.pdf"; 

            const formData = new FormData();
            formData.append("file", fs.createReadStream(resumePath));
            formData.append("job_description", job.jobDescription || job.requiredSkills);

            const pythonResponse = await axios.post("http://localhost:8000/parse", formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            aiParsedData = pythonResponse.data;
        } catch (aiError) {
            console.log("AI Parsing Warning (Fallback to basic match):", aiError.message);
        }

        const matchScore = aiParsedData.overall_score || 0;
        const matchedSkills = aiParsedData.matching_skills || [];
        const missingSkills = aiParsedData.missing_skills || [];

        const application = await Application.findOneAndUpdate(
            {
                studentId: studentId,
                roleApplied: job.roleTitle
            },
            {
                aiMatchScore: matchScore,
                matchedSkills: matchedSkills,
                missingSkills: missingSkills,
                aiSummary: aiParsedData.summary || ""
            },
            {
                upsert: true,
                new: true
            }
        );

        res.status(200).json({
            message: "AI Resume matching completed successfully",
            matchScore: matchScore,
            aiData: aiParsedData,
            application: application
        });

    } catch (error) {
        console.log("MATCH ERROR =", error);

        res.status(500).json({
            message: "Failed to calculate skill match",
            error: error.message
        });
    }
});

module.exports = router;