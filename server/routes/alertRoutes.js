const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const Measure = require("../models/Measures");

// Récuperation des alertes non résolues
router.get('/', async (req, res) => {
    try {
        const { location } = req.query;
        let query = { status: "unresolved" };
        if (location && location !== 'worldwide') {
            query.location = location;
        }
        const alerts = await Alert.find(query).sort('-createdAt');
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