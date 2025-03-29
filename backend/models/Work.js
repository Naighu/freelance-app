
const mongoose = require('mongoose');

const appliedSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    amount: { type: Number, required: true }
  });

const workSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true,},
    category: { type: String, required: true },
    budget: {type: Number,required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
    applied_users: [appliedSchema]
});


module.exports = mongoose.model('Work', workSchema);


