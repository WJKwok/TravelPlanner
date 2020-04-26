const { UserInputError } = require('apollo-server')
const Itinerary = require('../../models/Itinerary');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query:{
        async getItinerary(_, {itineraryId}, context) {
            //const user = checkAuth(context);
            try {
                const itinerary = await Itinerary.findById(itineraryId);
                return itinerary;
            } catch(err) {
                throw new Error(err);
            }
        },
        async getUserItineraries(_, {userId}) {            
            try {
                const itineraries = await Itinerary.find({ user: userId})
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
                let itinerary = await Itinerary.findById(id);
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
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const submitted = await newItinerary.save()

            return submitted;
        }
    }
}
