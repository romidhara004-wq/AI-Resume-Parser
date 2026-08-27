const mongoose = require("mongoose");
const User = require("./models/User");

// MongoDB connection URL (wahi jo aapke .env mein hai)
const MONGO_URI = "mongodb://localhost:27017/skillbridge_ai";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Database connected for testing...");

    try {
        // Ek dummy test user create karke database mein save kar rahe hain
        const testUser = new User({
            name: "Kamya Test",
            email: "kamyatest@gmail.com",
            password: "password123",
            role: "student"
        });

        await testUser.save();
        console.log("✅ Model Test Successful! User saved to database:", testUser);
    } catch (err) {
        console.log("❌ Test Failed Error:", err.message);
    } finally {
        mongoose.connection.close();
    }
});