const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    orderId: {
      type: Schema.ObjectId,
      required: true,
    },
    sellerId: {
      type: Schema.ObjectId,
      required: true,
    },
    razorpayOrderId: {
      type: String,
    },
    products: {
      type: Array,
      required: true,
    },
    codFee: {
      type: Number,
    },
    codFeeStatus: {
      type: String,
      default: "unpaid",
    },
    // color: {
    //   type: String,
    //   required: true,
    // },
    // size: {
    //   type: String,
    //   required: true,
    // },
    price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    shippingInfo: {
      type: Object,
      required: true,
    },
    delivery_status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("authorOrders", authorSchema);
