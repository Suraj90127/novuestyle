const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Home Page",
        "fastival",
        "Evil Eye Elegance",
        "Baby's Evil Eye Charms",
        "Product May You Like",
      ], // Add more as needed
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
