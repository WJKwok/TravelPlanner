const { model, Schema, connection } = require('mongoose');

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
	reviews: String,
});

module.exports = placeSchema;
// module.exports = model('Place', placeSchema);
