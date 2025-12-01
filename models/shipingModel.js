const { Schema, model } = require("mongoose");

const shippingSchema = new Schema({
  shipping_fee: {
    type: Number,
    default: 0,
  },
  cod_fee: {
    type: Number,
    default: 0,
  },
});

module.exports = model("shipping", shippingSchema);
