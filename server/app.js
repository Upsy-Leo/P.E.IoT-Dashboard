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
const measureRoutes = require("./routes/measureRoutes");
const alertRoutes = require("./routes/alertRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

// Liens
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/measures", measureRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/weather", weatherRoutes);

// Lancement du serveur
app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));