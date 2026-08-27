const axios = require("axios");

async function testMatch() {
    try {
        const jobId = "6a8ec21d1490854e139009d2";
        const studentId = "6a8e6b6f20650e4cbb5ba08d";

        console.log("⏳ AI Matching ho rahi hai, thoda wait karo...");
        
        const response = await axios.post(`http://localhost:5000/api/match/${jobId}/${studentId}`);

        console.log("\n✅ AI Matching Successful! Result yeh raha:\n");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ Error aaya:", error.response?.data || error.message);
    }
}

testMatch();