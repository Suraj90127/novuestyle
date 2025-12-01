const mongoose = require("mongoose");

const heading5Schema = new mongoose.Schema({
  heading5: { type: String, required: true },
  categorys: [
    {
      _id: String,      // store subcategory id
      sname: String,    // subcategory name
      sslug: String,    // optional
      simage: String    // optional
    }
  ]
});

module.exports = mongoose.model("Heading5", heading5Schema);
