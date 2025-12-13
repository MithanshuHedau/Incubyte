const Sweet = require("../model/Sweet.model");

async function createSweet(req, res) {
  try {
    const { name, category, price, quantity } = req.body;
    const sweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });
  }
}

async function getAllSweets(req, res) {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch sweets", error: err.message });
  }
}

async function searchSweets(req, res) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
}

async function updateSweet(req, res) {
  try {
    const { id } = req.params;
    const updated = await Sweet.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
}

async function deleteSweet(req, res) {
  try {
    const { id } = req.params;
    const removed = await Sweet.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
}

async function purchaseSweet(req, res) {
  try {
    const { id } = req.params;
    const qty = Number(req.body.quantity) || 1;
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Not found" });
    if (sweet.quantity < qty)
      return res.status(400).json({ message: "Insufficient quantity" });
    sweet.quantity -= qty;
    sweet.sold = (sweet.sold || 0) + qty;
    await sweet.save();
    res.json({ message: "Purchased", sweet });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed", error: err.message });
  }
}

async function restockSweet(req, res) {
  try {
    const { id } = req.params;
    const qty = Number(req.body.quantity);
    if (!qty || qty <= 0)
      return res.status(400).json({ message: "Invalid quantity" });
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Not found" });
    sweet.quantity += qty;
    await sweet.save();
    res.json({ message: "Restocked", sweet });
  } catch (err) {
    res.status(500).json({ message: "Restock failed", error: err.message });
  }
}
async function getAllUsers(req, res) {
  try {
    const User = require("../model/User.model");
    const allUsers = await User.find({ role: "user" });
    res.json(allUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
}

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  getAllUsers,
};
