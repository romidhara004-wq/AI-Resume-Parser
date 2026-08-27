  const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        studentName: {
            type: String,
            required: true
        },

        companyName: {
            type: String,
            required: true
        },

        roleApplied: {
            type: String,
            required: true
        },

        aiMatchScore: {
            type: String,
            required: true,
            default: "0"
        },

        status: {
            type: String,
            default: "AI Shortlisted & Forwarded"
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;