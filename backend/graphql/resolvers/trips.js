const { UserInputError, AuthenticationError } = require('apollo-server');
const Trip = require('../../models/Trip');
const Spot = require('../../models/Spot');
const checkAuth = require('../../utils/checkAuth');
const {getGooglePlace} = require('../../utils/googlePlaceApi');

module.exports = {
    Query:{
        async getUserTrips(_, {userId}){
            try {
                const trips = await Trip.find({user: userId}).populate('guide')
                return trips
            } catch(err) {
                throw new Error(err)
            }
        },
        async getTrip(_, {tripId}){
            try {
                const trip = await Trip.findById(tripId).populate('guide')
                const categoriesInTrip = trip.categoriesInTrip.map(category => {
                    return {category}
                })
                /* console.log(categoriesInTrip)
                [{"category":"Retail"},{"category":"Restaurant"},{"category":"Museum"}]
                */

                const spots = await Spot.find({
                    $and: [
                        {guide: trip.guide},
                        {$or: categoriesInTrip}
                    ]
                }).populate('place')
                // console.log(spots)
                
                // making an array of promise
                const placesFromGoogle = trip.googlePlacesInTrip.map(placeId => getGooglePlace(placeId))
                
                //getting the data from fulfilled promises
                const placeLoop = async() => {
                    let places = []
                    for await(const place of placesFromGoogle) {
                        places.push(place)
                    }
                    return places
                }

                const places = await placeLoop()
                // console.log('array of google places: ', places);

                const spotIds = spots.map(spot => spot.id);
                const flattenedDayLists = trip.dayLists.flat();
                const filteredSpots = spotIds.filter(id => !flattenedDayLists.includes(id));

                const result = {
                    // so _id cant be read by graphql query id
                    // ...trip._doc is not enough
                    ...trip.toObject({ virtuals: true }),
                    spotsArray: [...spots, ...places],
                    filteredSpots
                }
                return result
            } catch(err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async submitTrip(_, {guide, startDate, dayLists, categoriesInTrip, googlePlacesInTrip}, context) {
            const user = checkAuth(context);
            
            const newTrip = new Trip({
                guide,
                user: user.id,
                startDate,
                dayLists,
                categoriesInTrip,
                googlePlacesInTrip,
            })

            const submitted = await newTrip.save();
            return submitted;
        },
        async editTrip(_, {tripId, startDate, dayLists, categoriesInTrip, googlePlacesInTrip}, context) {
            const user = checkAuth(context);
            try{
                let trip = await Trip.findById(tripId);
                if (trip) {
                    trip.startDate = startDate
                    trip.dayLists = dayLists
                    trip.categoriesInTrip = categoriesInTrip
                    trip.googlePlacesInTrip = googlePlacesInTrip

                    await trip.save()
                    return trip;
                } else throw new UserInputError('Itinerary not found')
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteTrip(_, {tripId}, context) {
            const user = checkAuth(context)
            try {
                const trip = await Trip.findById(tripId)
                if (trip.user.toString() === user.id){
                    trip.delete()
                    return trip.id;
                } else {
                    throw new AuthenticationError('User does not own this trip')
                }
            } catch(err){
                throw new Error(err)
            }
        }
    }
}

