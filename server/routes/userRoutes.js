const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        console.log("Nombre d'utilisateurs trouvés :", users.length);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
