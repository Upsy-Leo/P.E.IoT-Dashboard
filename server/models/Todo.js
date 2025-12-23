const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, default: 'Ops' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", TodoSchema, 'Todos');
