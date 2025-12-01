const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    images: {
        type: [String],
        required: true
    }
});

const DiscountModel = mongoose.model('Discount', DiscountSchema);

module.exports = DiscountModel;
