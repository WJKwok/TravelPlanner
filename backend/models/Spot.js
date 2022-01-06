const { model, Schema, connection } = require('mongoose');

const spotSchema = new Schema({
	guide: {
		type: Schema.ObjectId,
		ref: 'Guide',
	},
	place: {
		type: String,
		ref: 'Place',
	},
	category: String,
	categories: [String],
	imgUrl: [String],
	content: String,
	date: String,
	eventName: String,
});

module.exports = spotSchema;
// module.exports = model('Spot', spotSchema);
