require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        const typeSearch = 'temperature';
        const latestMeasure = await Measure.findOne({ type: typeSearch }).sort({ creationDate: -1 });

        if (!latestMeasure) { console.log("No doc"); process.exit(); }

        console.log("ID:", latestMeasure._id);
        console.log("Date:", latestMeasure.creationDate);

        // Test 1: ID only
        const c1 = await Measure.countDocuments({ _id: latestMeasure._id });
        console.log("Count by ID:", c1);

        // Test 2: ID + Date LTE buffer
        const buffer = new Date(latestMeasure.creationDate);
        buffer.setHours(buffer.getHours() + 12);
        const c2 = await Measure.countDocuments({ _id: latestMeasure._id, creationDate: { $lte: buffer } });
        console.log("Count by ID + Date LTE:", c2);

        // Test 3: ID + Date GTE start
        const start = new Date(latestMeasure.creationDate);
        start.setHours(start.getHours() - 12);
        const c3 = await Measure.countDocuments({ _id: latestMeasure._id, creationDate: { $gte: start } });
        console.log("Count by ID + Date GTE:", c3);

        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
