require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected");

        // Get min and max date
        const result = await Measure.aggregate([
            {
                $group: {
                    _id: null,
                    minDate: { $min: "$creationDate" },
                    maxDate: { $max: "$creationDate" },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log("Date Range:", result);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
