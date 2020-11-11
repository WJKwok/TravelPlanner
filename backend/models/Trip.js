const { model, Schema } = require('mongoose');

const tripSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    guide: {
        type: Schema.ObjectId,
        ref: 'Guide',
    },
    startDate: String,
    dayLists: [],
    categoriesInTrip: [],
    likedSpots: [],
    googlePlacesInTrip: [],
});

module.exports = model('Trip', tripSchema);