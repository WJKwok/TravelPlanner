const { model, Schema } = require('mongoose');

const guideSchema = new Schema({
	name: String,
	city: String,
	coordinates: [Number],
	categories: [String],
	coverImage: String,
	plannerImage: String,
	logo: String,
});

module.exports = model('Guide', guideSchema);
