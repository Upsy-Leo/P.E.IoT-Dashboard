require('dotenv').config();
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

async function seed() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Seeding operational todos...");

    const initialTodos = [
        { text: "Check South Zone temperature sensors", priority: "high", category: "Maintenance" },
        { text: "Update threshold for Air Quality alerts", priority: "medium", category: "System" },
        { text: "Call technician for humidity recalibration", priority: "medium", category: "Ops" },
        { text: "Review weekly anomaly report", priority: "low", category: "Admin" }
    ];

    await Todo.deleteMany({});
    await Todo.insertMany(initialTodos);

    console.log("Seed complete.");
    process.exit();
}

seed();
