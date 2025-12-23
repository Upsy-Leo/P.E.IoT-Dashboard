const http = require('http');

http.get("http://localhost:3000/api/measures/stats?type=temperature&period=week", (res) => {
    let data = '';

    console.log("Status:", res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Data Length:", data.length);
        console.log("Data:", data);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
