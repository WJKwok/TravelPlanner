const { Schema } = require('mongoose');

const berlinPlaceSchema = new Schema({
	name: String,
	googlePlaceId: String,
	content: [String],
	category: [String],
	link: [String],
	tally: Number,
	bay_rating: Number,
});

module.exports = berlinPlaceSchema;
