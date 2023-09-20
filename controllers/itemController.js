
const Item = require('../models/Item');

// Controller function to create a new item
exports.createItem = async (req, res) => {
    try {
        console.log("Received item data:", req.body); // Debugging

        const item = new Item(req.body);
        await item.save();

        res.status(201).send(item);
    } catch (error) {
        console.error("Error in createItem:", error); // Debugging
        res.status(400).send({ message: error.message || "Failed to create item." });
    }
};


// Controller function to get all items, optionally filtered by category
exports.getAllItems = async (req, res, next) => {
    try {
        const { category } = req.query;
        let items;
        
        if (category) {
            items = await Item.find({ category });
        } else {
            items = await Item.find();
        }
        
        res.json(items);
    } catch (error) {
        next(error);
    }
};


// Controller function to get a list of unique item categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Item.distinct('category');
        res.json(categories);
    } catch (error) {
        next(error);
    }
};


// Controller function to update an existing item by ID
exports.updateItem = async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        updates.forEach(update => item[update] = req.body[update]);
        await item.save();
        res.send(item);
    } catch (error) {
        res.status(400).send(error);
    }
};


// Controller function to delete an item by ID
exports.deleteItem = (req, res) => {
    const itemId = req.params.id;

    Item.findByIdAndDelete(itemId)
        .then(() => {
            res.status(200).json({ message: 'Item deleted successfully.' });
        })
        .catch(error => {
            res.status(500).json({ error: 'Error deleting item.' });
        });
};

