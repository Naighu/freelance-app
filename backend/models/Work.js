
const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    budget: {type: Number,required: true}
});


module.exports = mongoose.model('Work', workSchema);


