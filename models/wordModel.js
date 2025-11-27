const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordSchema = new Schema({
  english: { type: String, required: true },
  german: { type: String, required: true },
  vietnamese: { type: String, required: true }
});

module.exports = mongoose.model('Words', WordSchema);