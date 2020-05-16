const { model, Schema } = require('mongoose');

const itinerarySchema = new Schema({
    city: String,
    username: String,
    createdAt: String,
    dayPlans: [],
    user: {
        type: Schema.ObjectId,
        ref: 'User',
    }
});

module.exports = model('Itinerary', itinerarySchema);