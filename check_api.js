const axios = require('axios');

async function check() {
    try {
        const res = await axios.get("http://localhost:3000/api/measures/stats?type=temperature&period=week");
        console.log("Status:", res.status);
        console.log("Data Length:", res.data.length);
        console.log("Data:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
}
check();
