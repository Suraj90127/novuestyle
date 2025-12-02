const { Schema, model } = require("mongoose");

const customerOrder = new Schema(
  {

      new_order_id: {
      type: String,
    },
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


// models/customerOrderModel.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const customerOrderSchema = new Schema(
//   {
//     new_order_id: {
//       type: String,
//       unique: true,
//       sparse: true // Allows existing documents without this field
//     },
//     customerId: {
//       type: Schema.ObjectId,
//       required: true,
//     },
//     razorpayOrderId: {
//       type: String,
//     },
//     codFee: {
//       type: Number,
//     },
//     codFeeStatus: {
//       type: String,
//       default: "unpaid",
//     },
//     products: {
//       type: Array,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     payment_status: {
//       type: String,
//       required: true,
//     },
//     shippingInfo: {
//       type: Object,
//       required: true,
//     },
//     delivery_status: {
//       type: String,
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     trackingNumber: {
//       type: String,
//     },
//     remarks: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// // Add pre-save middleware to generate new_order_id
// customerOrderSchema.pre('save', async function(next) {
//   if (!this.new_order_id) {
//     try {
//       const OrderCounter = mongoose.model('OrderCounter');
//       const counter = await OrderCounter.findByIdAndUpdate(
//         { _id: 'orderId' },
//         { $inc: { sequence_value: 1 } },
//         { new: true, upsert: true }
//       );
//       this.new_order_id = 'nvs' + counter.sequence_value;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("customerOrders", customerOrderSchema);