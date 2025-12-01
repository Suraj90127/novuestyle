const mongoose = require("mongoose");

const heading2Schema = new mongoose.Schema({
  heading2: { type: String, required: true },
  categorys: [
    {
      _id: String,      // store subcategory id
      sname: String,    // subcategory name
      sslug: String,    // optional
      simage: String    // optional
    }
  ]
});

const Heading2 = mongoose.model("Heading2", heading2Schema);

module.exports = Heading2;
