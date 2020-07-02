const { model, Schema } = require('mongoose');

const spotSchema = new Schema({
    guide: {
        type: Schema.ObjectId,
        ref: 'Guide',
    },
    place: {
        type: String,
        ref: 'Place'
    },
    category: String,
    imgUrl: String,
    content: String
});

module.exports = model('Spot', spotSchema);