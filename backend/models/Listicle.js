const { model, Schema } = require('mongoose');

const listicleSchema = new Schema({
	url: String,
	titleSelector: String,
	contentSelector: String,
});

module.exports = model('Listicle', listicleSchema);
