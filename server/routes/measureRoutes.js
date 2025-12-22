const express = require('express');
const router = express.Router();
const Measure = require('../models/Measures');

router.get('/stats', async (req, res) => {
    try {
        const { type, location } = req.query;

        if (!type) {
            return res.status(400).json({ message: "Le paramètre 'type' est requis (ex: airPollution)." });
        }

        let pipeline = [];

            // on filtre par type de mesure immédiatement 
        pipeline.push({ $match: { type: type } });

        // on joint avec Sensors pour faire le lien avec l'utilisateur
        pipeline.push({
            $lookup: {
                from: "Sensors",
                localField: "sensorID",
                foreignField: "_id",
                as: "sensor_info"
            }
        });
        pipeline.push({ $unwind: "$sensor_info" });

        // on joint avec Users pour accéder au champ 'location'
        pipeline.push({
            $lookup: {
                from: "Users",
                localField: "sensor_info.userID",
                foreignField: "_id",
                as: "user_info"
            }
        });
        pipeline.push({ $unwind: "$user_info" });

        // on filtre géographique optionnel (Worldwide par défaut)
        if (location && location !== 'worldwide') {
            pipeline.push({ $match: { "user_info.location": location } });
        }

        // on converti la date (String -> Date)
        pipeline.push({
            $addFields: {
                convertedDate: { $toDate: "$creationDate" }
            }
        });

        // on group par jour et calcul de la moyenne pour Recharts
        pipeline.push({
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$convertedDate" } },
                averageValue: { $avg: "$value" }
            }
        });

        // on tri chronologique (important pour un graphique en courbes)
        pipeline.push({ $sort: { "_id": 1 } });

        const stats = await Measure.aggregate(pipeline);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'agrégation : " + err.message });
    }
});

module.exports = router;