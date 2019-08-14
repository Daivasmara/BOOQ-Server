const { Schema, model } = require('mongoose');

const publisherSchema = new Schema({
  name: String
});

module.exports = model('Publisher', publisherSchema);
