const { Schema, model } = require("mongoose");

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
    },
    productId: {
      type: Schema.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("cardProducts", cardSchema);
