const { model, Schema } = require('mongoose');

const itinerarySchema = new Schema({
    city: String,
    username: String,
    createdAt: String,
    dayPlans: [],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    }
});

module.exports = model('Itinerary', itinerarySchema);