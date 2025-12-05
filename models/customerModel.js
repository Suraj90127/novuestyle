const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String, // Changed to String for phone numbers
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    otp: {
      type: Number
    },
    otpExpires: {
      type: Date
    },
    method: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("customers", customerSchema);