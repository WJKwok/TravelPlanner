const { model, Schema } = require('mongoose');

const guideSchema = new Schema({
    name: String,
    city: String,
    categories: [],
    spot: {
        type: Schema.ObjectId,
        ref: 'Spot',
    }
});

module.exports = model('Guide', guideSchema);