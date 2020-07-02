const Place = require('../../models/Place');

module.exports = {
    Mutation: {
        async savePlace(
            _, 
            {placeInput: {id, name, rating, address, location}}){
            
            try {
                let place = await Place.findById(id);
                if (place) {
                    return place
                } else {
                    const newPlace = new Place({
                        _id: id,
                        name,
                        rating,
                        address,
                        location,
                        updatedAt: new Date().toISOString()
                    })
        
                    const submitted = await newPlace.save();
                    return submitted;
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}