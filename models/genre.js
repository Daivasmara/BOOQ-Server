const { Schema, model } = require('mongoose');

const genreSchema = new Schema({
  name: String
});

module.exports = model('Genre', genreSchema);