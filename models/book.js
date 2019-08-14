const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  name: String,
  genre: String,
  authorid: String
});

module.exports = model('Book', bookSchema);
