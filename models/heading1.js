const mongoose = require("mongoose");

const heading1Schema = new mongoose.Schema({
  heading1: { type: String, required: true },
  categorys: [
    {
      _id: String, // store subcategory id
      sname: String, // subcategory name
      sslug: String, // optional
      simage: String, // optional
    },
  ],
});

const Heading1 = mongoose.model("Heading1", heading1Schema);

module.exports = Heading1;
