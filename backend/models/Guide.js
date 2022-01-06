const { model, Schema, connection } = require('mongoose');

const guideSchema = new Schema({
	name: String,
	city: String,
	coordinates: [Number],
	categories: [String],
	coverImage: String,
	plannerImage: String,
	logo: String,
});

module.exports = guideSchema;
// module.exports = model('Guide', guideSchema);
