const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

router.get('/profile', async (req, res) => {
    let admin = await Admin.findOne({username: "Sylvie"});
    if (!admin) {
        admin = await Admin.create({username: "Sylvie"});
    }
    res.json(admin); 
})
 
module.exports = router; 