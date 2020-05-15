const { UserInputError, AuthenticationError } = require('apollo-server')
const Itinerary = require('../../models/Itinerary');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query:{
        async getItinerary(_, {itineraryId}, context) {
            //const user = checkAuth(context);
            try {
                const itinerary = await Itinerary.findById(itineraryId).populate('user');
                return itinerary;
            } catch(err) {
                throw new Error(err);
            }
        },
        async getUserItineraries(_, {userId}) {            
            try {
                const itineraries = await Itinerary.find({ user: userId}).populate('user')
                return itineraries
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async saveItinerary(_, {id, dayPlans}, context){
            const user = checkAuth(context);
            try{
                let itinerary = await Itinerary.findById(id).populate('user');
                if (itinerary) {
        
                    itinerary.dayPlans = dayPlans
                    await itinerary.save()
            
                    return itinerary;

                } else throw new UserInputError('Itinerary not found')
            } catch (err) {
                throw new Error(err);
            }
        },
        async submitItinerary(_, {dayPlans, city}, context) {
            const user = checkAuth(context);

            if (dayPlans.length === 0){
                throw new Error('Itinerary should not be empty');
            }

            const newItinerary = new Itinerary({
                city: city,
                dayPlans,
                user: user.id,
                createdAt: new Date().toISOString()
            })

            const submitted = await newItinerary.save();

            return submitted;
        },
        async deleteItinerary(_, {itineraryId}, context) {
            const user = checkAuth(context);
            
            try {
                const itinerary = await Itinerary.findById(itineraryId);
                if (itinerary.user.toString() === user.id) {
                    itinerary.delete()
                    return itinerary.id;
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}
