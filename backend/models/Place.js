const { model, Schema } = require('mongoose');

const placeSchema = new Schema({
    _id: String,
    name: String,
    rating: Number,
    address: String,
    location: [Number],
    updatedAt: String,
})

module.exports = model('Place', placeSchema)