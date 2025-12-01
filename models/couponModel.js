const { Schema, model } = require("mongoose");

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },

    userlimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("coupon", couponSchema);
