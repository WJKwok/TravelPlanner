const userResolvers = require('./users');
const itineraryResolvers = require('./itineraries');

module.exports = {
    Query: {
        ...userResolvers.Query,
        ...itineraryResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutataion,
        ...itineraryResolvers.Mutation,
    }
}