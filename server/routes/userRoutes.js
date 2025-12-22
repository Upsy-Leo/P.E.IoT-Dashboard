const express = require("express");
const router = express.Router();
const User = require("../models/User");

//  Route pour récupérer la liste de tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        console.log("Nombre d'utilisateurs trouvés :", users.length);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer la liste unique des pays (pour sélecteur global)
router.get('/locations', async (req, res) => {
    try {
        const locations = await User.distinct('location');
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
