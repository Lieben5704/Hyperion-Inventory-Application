const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,             // Name of the item
    quantity: Number,         // Current quantity of the item
    threshold: Number,        // Threshold quantity when stock gets low
    supplierName: String,     // Name of the supplier
    category: String          // Category of the item
});

// Create and export the 'Item' model using the schema
module.exports = mongoose.model('Item', itemSchema);
