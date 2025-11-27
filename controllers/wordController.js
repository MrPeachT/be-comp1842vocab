const Words = require('../models/wordModel');

exports.list_all_words = async (req, res) => {
  try {
    const items = await Words.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create_a_word = async (req, res) => {
  try {
    console.log('Body received:', req.body);
    const item = new Words(req.body);
    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.read_a_word = async (req, res) => {
  try {
    const item = await Words.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update_a_word = async (req, res) => {
  try {
    const updated = await Words.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete_a_word = async (req, res) => {
  try {
    const deleted = await Words.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};