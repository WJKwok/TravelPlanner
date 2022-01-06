const guideSchema = require('./Guide');
const tripSchema = require('./Trip');
const userSchema = require('./User');
const itinerarySchema = require('./Itinerary');
const placeSchema = require('./Place');
const spotSchema = require('./Spot');
const berlinPlaceSchema = require('./BerlinPlace');
const { connection } = require('mongoose');

const testCollection = connection.useDb('test');
const cityTravelCollection = connection.useDb('CityTravel');
// https://stackoverflow.com/questions/40079200/how-to-declare-collection-name-and-model-name-in-mongoose
const BerlinPlace = cityTravelCollection.model(
	'BerlinPlace',
	berlinPlaceSchema,
	'berlinPlaces'
);
const Guide = testCollection.model('Guide', guideSchema);
const Trip = testCollection.model('Trip', tripSchema);
const User = testCollection.model('User', userSchema);
const Itinerary = testCollection.model('Itinerary', itinerarySchema);
const Place = testCollection.model('Place', placeSchema);
const Spot = testCollection.model('Spot', spotSchema);
module.exports = { Guide, Trip, User, Itinerary, Place, Spot, BerlinPlace };
