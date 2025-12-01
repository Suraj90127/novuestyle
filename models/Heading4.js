const mongoose = require("mongoose");

const heading4Schema =  new mongoose.Schema({
  heading4: { type: String, required: true },
  categorys: [
    {
      _id: String,      // store subcategory id
      sname: String,    // subcategory name
      sslug: String,    // optional
      simage: String    // optional
    }
  ]
});

const Heading4 = mongoose.model("Heading4", heading4Schema);

module.exports = Heading4;
