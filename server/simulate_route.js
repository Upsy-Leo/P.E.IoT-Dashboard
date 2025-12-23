require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        const type = 'temperature';
        const period = 'week';

        let pipeline = [];
        let matchStage = { type: type };

        const latestMeasure = await Measure.findOne({ type: type }).sort({ creationDate: -1 });
        console.log("Latest Doc found:", latestMeasure);
        if (latestMeasure) {
            console.log("Type of creationDate:", latestMeasure.creationDate.constructor.name);
            console.log("Value:", latestMeasure.creationDate);
        }

        const now = latestMeasure ? new Date(latestMeasure.creationDate) : new Date();
        console.log("Latest Date (Exact):", now);

        // ADD 1 DAY BUFFER just to be absolutely sure
        const bufferNow = new Date(now);
        bufferNow.setDate(bufferNow.getDate() + 1);
        console.log("End Date (Buffer +1 day):", bufferNow);

        let startDate = new Date(now);
        // Week logic
        startDate.setDate(now.getDate() - 7);
        console.log("Start Date:", startDate);

        // On prend tout ce qui est entre startDate et maintenant (mocké)
        matchStage.creationDate = { $gte: startDate, $lte: bufferNow };

        console.log("Match Stage:", matchStage);

        pipeline.push({ $match: matchStage });

        // ... rest of pipeline
        pipeline.push({
            $addFields: {
                convertedDate: { $toDate: "$creationDate" }
            }
        });

        pipeline.push({
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$convertedDate" } },
                averageValue: { $avg: "$value" }
            }
        });

        pipeline.push({ $sort: { "_id": 1 } });

        const stats = await Measure.aggregate(pipeline);
        console.log("Stats found:", stats.length);
        console.log(JSON.stringify(stats, null, 2));

        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
