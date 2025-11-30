const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nonEmptyString = {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: v => {
      if (!v) return false;
      const trimmed = v.trim();
      if (trimmed.length === 0) return false;
      if (/\d/.test(trimmed)) return false;
      return true;
    },
    message: 'Field must not be empty, whitespace only, or contain numbers'
  }
};

const WordSchema = new Schema({
  english: nonEmptyString,
  german: nonEmptyString,
  vietnamese: nonEmptyString,

  imageUrl: {
    type: String,
    trim: true,
    required: false
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Words', WordSchema);