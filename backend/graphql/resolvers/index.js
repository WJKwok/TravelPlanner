const userResolvers = require('./users');
const itineraryResolvers = require('./itineraries');
const guideResolvers = require('./guides');
const spotResolvers = require('./spots');
const placeResolvers = require('./places');
const tripResolvers = require('./trips');
const listicleResolvers = require('./listicles');

module.exports = {
	Query: {
		...userResolvers.Query,
		...itineraryResolvers.Query,
		...guideResolvers.Query,
		...spotResolvers.Query,
		...tripResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutataion,
		...itineraryResolvers.Mutation,
		...placeResolvers.Mutation,
		...spotResolvers.Mutation,
		...tripResolvers.Mutation,
		...listicleResolvers.Mutation,
	},
	Subscription: {
		...tripResolvers.Subscription,
	},
};
