const express = require('express');
const router = express.Router();
const Measure = require('../models/Measures');
const mongoose = require('mongoose');

router.get('/stats', async (req, res) => {
    try {
        const { type, location, userId, period } = req.query;

        if (!type) {
            return res.status(400).json({ message: "Le paramètre 'type' est requis (ex: airPollution)." });
        }

        let pipeline = [];
        let matchStage = { type: type };
        let dateFilter = null;

        // Filtrage par période
        if (period && period !== 'all') {
            // "Smart Date": On se base sur la date la plus récente en base pour que la démo soit toujours vivante
            const latestMeasure = await Measure.findOne({ type: type }).sort({ creationDate: -1 });
            const now = latestMeasure ? new Date(latestMeasure.creationDate) : new Date();

            let startDate = new Date(now);

            switch (period) {
                case 'week': startDate.setDate(now.getDate() - 7); break;
                case 'month': startDate.setMonth(now.getMonth() - 1); break;
                case '6months': startDate.setMonth(now.getMonth() - 6); break;
                case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
            }
            // On prend tout ce qui est entre startDate et maintenant (mocké)
            dateFilter = { $gte: startDate, $lte: now };
        }

        // on filtre par type de mesure immédiatement 
        pipeline.push({ $match: matchStage });

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

        if (userId) {
            // Si on a un ID utilisateur, on filtre directement par userID dans Sensor
            pipeline.push({ $match: { "sensor_info.userID": new mongoose.Types.ObjectId(userId) } });
        } else if (location && location.toLowerCase() !== 'worldwide') {
            // Sinon, on fait la jointure User pour filtrer par pays
            pipeline.push({ $lookup: { from: "Users", localField: "sensor_info.userID", foreignField: "_id", as: "user_info" } });
            pipeline.push({ $unwind: "$user_info" });
            pipeline.push({ $match: { "user_info.location": location } });
        }

        // on converti la date (String -> Date)
        pipeline.push({
            $addFields: {
                convertedDate: { $toDate: "$creationDate" }
            }
        });

        // Filtrage temporel APRES conversion pour gérer le cas où en base c'est du String
        if (dateFilter) {
            pipeline.push({ $match: { convertedDate: dateFilter } });
        }

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
        console.log(`Stats request: type=${type}, location=${location}, userId=${userId}, found ${stats.length} results.`);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'agrégation : " + err.message });
    }
});

router.get('/detail', async (req, res) => {
    try {
        const { date, type } = req.query;
        let query = { type: type };

        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        query.creationDate = { $gte: startOfDay, $lt: endOfDay };

        const measures = await Measure.find(query)
            .populate({
                path: 'sensorID',
                populate: { path: 'userID' }
            });

        res.json(measures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer toutes les mesures
router.get('/', async (req, res) => {
    try {
        const measures = await Measure.find()
            .populate({
                path: 'sensorID',
                populate: { path: 'userID' }
            })
            .sort({ creationDate: -1 });
        res.json(measures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour ajouter une nouvelle mesure
router.post('/', async (req, res) => {
    try {
        const { type, sensorID, value } = req.body;
        const newMeasure = new Measure({
            type,
            sensorID,
            value,
            creationDate: new Date()
        });
        const savedMeasure = await newMeasure.save();
        res.status(201).json(savedMeasure);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour mettre à jour une mesure
router.patch('/:id', async (req, res) => {
    try {
        const updatedMeasure = await Measure.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMeasure);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour supprimer une mesure
router.delete('/:id', async (req, res) => {
    try {
        await Measure.findByIdAndDelete(req.params.id);
        res.json({ message: "Mesure supprimée" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;