const { model, Schema, connection } = require('mongoose');

const itinerarySchema = new Schema({
	city: String,
	username: String,
	createdAt: String,
	dayPlans: [],
	user: {
		type: Schema.ObjectId,
		ref: 'User',
	},
});

module.exports = itinerarySchema;
// module.exports = model('Itinerary', itinerarySchema);
