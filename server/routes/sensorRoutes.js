const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// Route pour récupérer tous les capteurs
router.get('/', async (req, res) => {
    try {
        const sensors = await Sensor.find().populate('userID');
        res.json(sensors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour créer un nouveau capteur
router.post('/', async (req, res) => {
    try {
        const newSensor = new Sensor({
            location: req.body.location,
            userID: req.body.userID,
            creationDate: new Date().toISOString()
        });
        const savedSensor = await newSensor.save();
        res.status(201).json(savedSensor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour mettre à jour un capteur
router.patch('/:id', async (req, res) => {
    try {
        const updatedSensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSensor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour supprimer un capteur
router.delete('/:id', async (req, res) => {
    try {
        await Sensor.findByIdAndDelete(req.params.id);
        res.json({ message: "Capteur supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
