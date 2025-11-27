const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nonEmptyString = {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: v => v && v.trim().length > 0,
    message: 'Field cannot be empty or whitespace only'
  }
};

const WordSchema = new Schema({
  english: nonEmptyString,
  german: nonEmptyString,
  vietnamese: nonEmptyString
});

module.exports = mongoose.model('Words', WordSchema);