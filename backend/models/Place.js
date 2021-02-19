const { model, Schema } = require('mongoose');

const placeSchema = new Schema({
	_id: String,
	name: String,
	businessStatus: String,
	rating: Number,
	userRatingsTotal: Number,
	address: String,
	location: [Number],
	hours: [String],
	updatedAt: String,
	internationalPhoneNumber: String,
	website: String,
});

module.exports = model('Place', placeSchema);
