 const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            required: true,
            enum: ["student","company","college"],
            default:"student"
        }
    },
    { timestamps: true } // Yeh automatically 'createdAt' aur 'updatedAt' track karega
);

const User = mongoose.model("User", userSchema);

module.exports = User;