const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Job = require("./models/Job");
const User = require("./models/User");

async function fetchIds() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB successfully!");

        const job = await Job.findOne();
        const user = await User.findOne();

        console.log("\n--------------------------------");
        console.log("👉 Tumhari Job ID:", job ? job._id.toString() : "Koi Job nahi mili!");
        console.log("👉 Tumhari Student ID:", user ? user._id.toString() : "Koi User nahi mila!");
        console.log("--------------------------------\n");

        process.exit();
    } catch (err) {
        console.error("Error:", err.message);
    }
}

fetchIds();