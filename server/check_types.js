require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        const types = await Measure.distinct("type");
        console.log("Types in DB:", types);

        const countLower = await Measure.countDocuments({ type: 'temperature' });
        const countUpper = await Measure.countDocuments({ type: 'Temperature' });
        console.log(`Count 'temperature': ${countLower}`);
        console.log(`Count 'Temperature': ${countUpper}`);

        // Check latest date for 'temperature'
        const latest = await Measure.findOne({ type: 'temperature' }).sort({ creationDate: -1 });
        console.log("Latest 'temperature' date:", latest ? latest.creationDate : "None");

        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
