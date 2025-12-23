require('dotenv').config();
const mongoose = require('mongoose');
const Alert = require('./models/Alert');
require('./models/Measures');
require('./models/Sensor');
require('./models/User');

async function testAggregation() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Testing Aggregation Pipeline...");

        // On prend un utilisateur au hasard pour tester
        const User = mongoose.model('User');
        const user = await User.findOne();
        if (!user) {
            console.log("No users found to test with.");
            process.exit(0);
        }

        const userId = user._id.toString();
        console.log("Testing with User ID:", userId);

        let pipeline = [];
        pipeline.push({ $match: { status: "unresolved" } });

        pipeline.push({
            $lookup: {
                from: "Measures",
                localField: "measureID",
                foreignField: "_id",
                as: "measureID"
            }
        });
        pipeline.push({ $unwind: "$measureID" });

        pipeline.push({
            $lookup: {
                from: "Sensors",
                localField: "measureID.sensorID",
                foreignField: "_id",
                as: "measureID.sensorID"
            }
        });
        pipeline.push({ $unwind: "$measureID.sensorID" });

        pipeline.push({
            $lookup: {
                from: "Users",
                localField: "measureID.sensorID.userID",
                foreignField: "_id",
                as: "measureID.sensorID.userID"
            }
        });
        pipeline.push({ $unwind: "$measureID.sensorID.userID" });

        // On teste le match
        pipeline.push({
            $match: { "measureID.sensorID.userID._id": new mongoose.Types.ObjectId(userId) }
        });

        const results = await Alert.aggregate(pipeline);
        console.log("Found results:", results.length);
        process.exit(0);
    } catch (err) {
        console.error("Aggregation failed:", err);
        process.exit(1);
    }
}

testAggregation();
