const mongoose = require("mongoose");

const heading3Schema = new mongoose.Schema({
  heading3: { type: String, required: true },
  categorys: [
    {
      _id: String,      // store subcategory id
      sname: String,    // subcategory name
      sslug: String,    // optional
      simage: String    // optional
    }
  ]
});

const Heading3 = mongoose.model("Heading3", heading3Schema);

module.exports = Heading3;
