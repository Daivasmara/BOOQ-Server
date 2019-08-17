const { Schema, model } = require('mongoose');

const authorSchema = new Schema({
  name: String,
  bio: String,
  birth_city: String,
  birthdate: Date
});

module.exports = model('Author', authorSchema);
