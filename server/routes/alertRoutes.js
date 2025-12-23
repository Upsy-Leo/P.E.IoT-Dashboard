const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const Measure = require("../models/Measures");
const Sensor = require("../models/Sensor");
const User = require("../models/User");

// Récuperation des alertes non résolues
router.get('/', async (req, res) => {
    try {
        const { location, userId } = req.query;
        let pipeline = [];

        // 1. On ne prend que les alertes non résolues
        pipeline.push({ $match: { status: "unresolved" } });

        // 2. Jointure avec Measures
        pipeline.push({
            $lookup: {
                from: "Measures",
                localField: "measureID",
                foreignField: "_id",
                as: "measureID"
            }
        });
        pipeline.push({ $unwind: "$measureID" });

        // 3. Jointure avec Sensors
        pipeline.push({
            $lookup: {
                from: "Sensors",
                localField: "measureID.sensorID",
                foreignField: "_id",
                as: "measureID.sensorID"
            }
        });
        pipeline.push({ $unwind: "$measureID.sensorID" });

        // 4. Jointure avec Users
        pipeline.push({
            $lookup: {
                from: "Users",
                localField: "measureID.sensorID.userID",
                foreignField: "_id",
                as: "measureID.sensorID.userID"
            }
        });
        pipeline.push({ $unwind: "$measureID.sensorID.userID" });

        // 5. Filtres GRIB (Global)
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
            pipeline.push({
                $match: { "measureID.sensorID.userID._id": new mongoose.Types.ObjectId(userId) }
            });
        } else if (location && location.toLowerCase() !== 'worldwide') {
            pipeline.push({
                $match: { "measureID.sensorID.userID.location": location }
            });
        }

        // 6. Tri
        pipeline.push({ $sort: { createdAt: -1 } });

        const alerts = await Alert.aggregate(pipeline);
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Traitement des alertes = xp pour l'admin
router.post('/:id/resolve', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { status: "resolved" }, { new: true });

        if (alert) {
            //ajouter logique pour augmenter xp
            const User = require("../models/User");
            const user = await User.findOne({ username: 'Sylvie Martin' });
            if (user) {
                user.xp += 250;
                if (user.xp >= 1000) {
                    user.level += 1;
                    user.xp = user.xp % 1000;
                }
                await user.save();
            }
        }

        res.json(alert);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;