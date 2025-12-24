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

// Route pour créer un nouvel utilisateur
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour mettre à jour un utilisateur
router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
