const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    brand: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    design: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      // required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Shippingcharge: {
      type: String,
    },
    Shippingtime: {
      type: String,
    },
    shopName: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    // 🆕 NEW FIELD: Key Highlights Images
    keyHighlights: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    size: {
      type: [String], // Array of sizes (e.g., ["S", "M", "L", "XL"])
      default: [],
    },
    color: {
      type: [String], // Array of colors (e.g., ["Red", "Blue", "Green"])
      default: [],
    },
    points: {
      type: [String],
      default: [],
    },
    section: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    name: "text",
    category: "text",
    brand: "text",
    description: "text",
  },
  {
    weights: {
      name: 5,
      category: 4,
      brand: 3,
      description: 2,
    },
  }
);

module.exports = model("products", productSchema);
