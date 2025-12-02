// models/orderCounterModel.js
const mongoose = require('mongoose');

const orderCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 98001 }
});

module.exports = mongoose.model('OrderCounter', orderCounterSchema);