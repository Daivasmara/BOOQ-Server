const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: String,
  synopsis: String,
  published_date: Date,
  language: String,
  publisher_id: String,
  author_id: [String],
  genres_id: [String]
});

module.exports = model('Book', bookSchema);
