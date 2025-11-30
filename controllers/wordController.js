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
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const item = new Words({
      english: req.body.english,
      german: req.body.german,
      vietnamese: req.body.vietnamese,
      imageUrl: req.body.imageUrl || '',
      owner: req.user.id        
    });

    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.read_a_word = async (req, res) => {
  try {
    const item = await Words.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function canModify(word, user) {
  if (!user) return false;
  if (user.role === 'admin') return true;

  if (!word.owner) return false;

  return word.owner.toString() === user.id;
}

exports.update_a_word = async (req, res) => {
  try {
    const item = await Words.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    if (!canModify(item, req.user)) {
      return res.status(403).json({ error: 'Not allowed to edit this word' });
    }

    item.english = req.body.english;
    item.german = req.body.german;
    item.vietnamese = req.body.vietnamese;
    item.imageUrl = req.body.imageUrl || '';

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete_a_word = async (req, res) => {
  try {
    const item = await Words.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    if (!canModify(item, req.user)) {
      return res.status(403).json({ error: 'Not allowed to delete this word' });
    }

    await item.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};