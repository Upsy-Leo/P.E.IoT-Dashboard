require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connecté à MongoDB"))
.catch((err) => console.error("Erreur de connexion à MongoDB", err));

// Route test
app.get("/", (req, res) => {
    res.send("API Ok.");
});

// PORT
const PORT = process.env.PORT || 3000;

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const todoRoutes = require("./routes/todoRoutes");

// Liens
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/todos", todoRoutes);

// Lancement du serveur
app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));