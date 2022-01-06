const { model, Schema, connection } = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
	role: String,
	trips: [
		{
			type: Schema.ObjectId,
			ref: 'Trip',
		},
	],
});

module.exports = userSchema;
// module.exports = model('User', userSchema);
