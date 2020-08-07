const { model, Schema } = require('mongoose');

const guideSchema = new Schema({
    name: String,
    city: String,
    categories: [],
    coverImage: String,
});

module.exports = model('Guide', guideSchema);