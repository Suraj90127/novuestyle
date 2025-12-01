const { Schema, model } = require("mongoose");

const customerOrder = new Schema(
  {
    customerId: {
      type: Schema.ObjectId,
      required: true,
    },
    razorpayOrderId: {
      type: String,
    },
    codFee: {
      type: Number,
    },
    codFeeStatus: {
      type: String,
      default: "unpaid",
    },
    products: {
      // color: {
      //   type: String,
      //   required: true,
      // },
      // size: {
      //   type: String,
      //   required: true,
      // },
      type: Array,
      required: true,
    },
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

module.exports = model("customerOrders", customerOrder);
