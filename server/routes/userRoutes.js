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

// Route pour récupérer le profil de l'utilisateur actuel (Sylvie Martin par défaut pour la démo)
router.get('/me', async (req, res) => {
    try {
        let user = await User.findOne({ username: 'Sylvie Martin' });

        if (!user) {
            // Création du profil Sylvie si inexistant
            user = new User({
                username: 'Sylvie Martin',
                role: 'Operations Manager',
                xp: 850,
                level: 5,
                location: 'Worldwide'
            });
            await user.save();
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
