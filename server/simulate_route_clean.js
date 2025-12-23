require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        const type = 'temperature';
        const typeSearch = 'temperature';

        console.log("Searching for type:", typeSearch);

        const latestMeasure = await Measure.findOne({ type: typeSearch }).sort({ creationDate: -1 });

        if (latestMeasure) {
            console.log("FOUND DOC.");
            console.log("creationDate value:", latestMeasure.creationDate);
            console.log("creationDate constructor:", latestMeasure.creationDate.constructor.name);
            console.log("typeof creationDate:", typeof latestMeasure.creationDate);
        } else {
            console.log("NO DOC FOUND.");
            process.exit();
        }

        const now = new Date(latestMeasure.creationDate);
        console.log("Now (from doc):", now);

        // Buffer + 1 day
        const bufferNow = new Date(now);
        bufferNow.setDate(bufferNow.getDate() + 1);

        // Start date - 7 days
        let startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);

        console.log("StartDate:", startDate);
        console.log("EndDate:", bufferNow);

        const matchStage = {
            type: typeSearch,
            creationDate: { $gte: startDate, $lte: bufferNow }
        };

        console.log("Testing Match:", JSON.stringify(matchStage));

        const count = await Measure.countDocuments(matchStage);
        console.log("Count with exact match pipeline logic:", count);

        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
