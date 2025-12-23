require("dotenv").config();
const mongoose = require("mongoose");
const Measure = require("./models/Measures");

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        const result = await Measure.aggregate([
            {
                $group: {
                    _id: null,
                    minDate: { $min: "$creationDate" },
                    maxDate: { $max: "$creationDate" }
                }
            }
        ]);
        console.log("MIN_DATE: " + result[0].minDate);
        console.log("MAX_DATE: " + result[0].maxDate);
        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
