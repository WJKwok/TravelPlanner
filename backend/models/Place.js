const { model, Schema } = require('mongoose');

const placeSchema = new Schema({
    _id: String,
    name: String,
    businessStatus: String,
    rating: Number,
    address: String,
    location: [Number],
    hours: [String],
    updatedAt: String,
})

module.exports = model('Place', placeSchema)