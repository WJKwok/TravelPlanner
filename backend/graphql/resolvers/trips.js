const { UserInputError, ForbiddenError, withFilter } = require('apollo-server');
const Trip = require('../../models/Trip');
const Spot = require('../../models/Spot');
const checkAuth = require('../../utils/checkAuth');
const { getGooglePlace } = require('../../utils/googlePlaceApi');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	Query: {
		async getUserTrips(_, { userId }) {
			try {
				const users = await User.findById(userId).populate({
					path: 'trips',
					populate: { path: 'guide user' },
				});

				return users.trips;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getTrip(_, { tripId }, context) {
			const user = checkAuth(context);
			// try {
			const trip = await Trip.findById(tripId).populate('guide');
			if (trip) {
				console.log({
					tripUser: trip.user.toString(),
					userId: user.id,
					tripShared: trip.sharedWith,
					email: user.email,
					firstBool: trip.user.toString() !== user.id,
					secondBool: !trip.sharedWith.includes(user.email),
				});

				if (
					trip.user.toString() !== user.id &&
					!trip.sharedWith.includes(user.email)
				) {
					throw new ForbiddenError('User does not own this trip');
				}

				const categoriesInTrip = trip.categoriesInTrip.map((category) => {
					return { categories: category };
				});

				/* console.log(categoriesInTrip)
					[{"category":"Retail"},{"category":"Restaurant"},{"category":"Museum"}]
					*/

				const spots = await Spot.find({
					$and: [{ guide: trip.guide }, { $or: categoriesInTrip }],
				}).populate('place');

				const places = await Promise.all(
					trip.googlePlacesInTrip.map((placeId) => getGooglePlace(placeId))
				);
				// console.log('array of google places: ', places);

				const spotIds = spots.map((spot) => spot.id);
				const flattenedDayLists = trip.dayLists.flat();
				const filteredSpots = spotIds.filter(
					(id) => !flattenedDayLists.includes(id)
				);

				const result = {
					// so _id cant be read by graphql query id
					// ...trip._doc is not enough
					...trip.toObject({ virtuals: true }),
					spotsArray: [...spots, ...places],
					filteredSpots,
				};
				return result;
			}
			// } catch (err) {
			// 	console.log(err);
			// 	throw new Error(err);
			// }
		},
	},
	Mutation: {
		async submitTrip(
			_,
			{
				guide,
				startDate,
				dayLists,
				categoriesInTrip,
				likedSpots,
				googlePlacesInTrip,
			},
			context
		) {
			const user = checkAuth(context);

			const newTrip = new Trip({
				guide,
				user: user.id,
				startDate,
				dayLists,
				categoriesInTrip,
				likedSpots,
				googlePlacesInTrip,
				shared: [],
			});

			const submitted = await newTrip.save();
			return submitted;
		},
		async editTrip(
			_,
			{
				tripId,
				startDate,
				dayLists,
				categoriesInTrip,
				likedSpots,
				googlePlacesInTrip,
			},
			context
		) {
			const user = checkAuth(context);

			try {
				let trip = await Trip.findById(tripId);
				if (trip) {
					if (
						trip.user.toString() !== user.id &&
						!trip.sharedWith.includes(user.email)
					) {
						throw new ForbiddenError('User does not own this trip');
					}

					trip.startDate = startDate;
					trip.dayLists = dayLists;
					trip.categoriesInTrip = categoriesInTrip;
					trip.googlePlacesInTrip = googlePlacesInTrip;
					trip.likedSpots = likedSpots;

					await trip.save();
					context.pubsub.publish('EDITED_TRIP', {
						sharedTripEdited: trip,
					});
					return trip;
				} else throw new UserInputError('Itinerary not found');
			} catch (err) {
				throw new Error(err);
			}
		},
		async deleteTrip(_, { tripId }, context) {
			const user = checkAuth(context);
			try {
				const trip = await Trip.findById(tripId);
				if (trip.user.toString() === user.id) {
					trip.delete();
					return trip.id;
				} else {
					throw new ForbiddenError('User does not own this trip');
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async shareTripAddUser(_, { tripId, email }, context) {
			const user = checkAuth(context);
			const trip = await Trip.findById(tripId);
			const userToAdd = await User.findOne({ email });
			if (trip.user.toString() !== user.id) {
				throw new ForbiddenError('User does not own this trip');
			} else if (!userToAdd) {
				throw new Error(`Could not find user with ${email}`);
			} else {
				console.log('userToAdd', userToAdd);
				try {
					tripIdToObjectID = ObjectId(tripId);
					trip.sharedWith = [...trip.sharedWith, userToAdd.email];
					userToAdd.trips = [...userToAdd.trips, tripIdToObjectID];
					await userToAdd.save();
					await trip.save();
					return trip;
				} catch (err) {
					throw new Error(err);
				}
			}
		},
		async shareTripRemoveUser(_, { tripId, email }, context) {
			const user = checkAuth(context);
			const trip = await Trip.findById(tripId);
			const userToRemove = await User.findOne({ email });
			if (trip.user.toString() !== user.id) {
				throw new ForbiddenError('User does not own this trip');
			} else if (!userToRemove) {
				throw new Error(`Could not find user with ${email}`);
			} else {
				try {
					trip.sharedWith = trip.sharedWith.filter(
						(user) => user !== userToRemove.email
					);
					userToRemove.trips = userToRemove.trips.filter(
						(trip) => trip.toString() !== tripId
					);
					console.log('userToRemove', userToRemove.trips, trip);
					await userToRemove.save();
					await trip.save();
					return trip;
				} catch (err) {
					throw new Error(err);
				}
			}
		},
		async shareTrip(_, { tripId, emails }, context) {
			const user = checkAuth(context);
			const trip = await Trip.findById(tripId);
			if (trip.user.toString() === user.id) {
				trip.sharedWith = emails;
				await trip.save();
				return trip;
			} else {
				throw new ForbiddenError('User does not own this trip');
			}
		},
	},
	Subscription: {
		sharedTripEdited: {
			subscribe: withFilter(
				(_, __, { pubsub }) => pubsub.asyncIterator('EDITED_TRIP'),
				(payload, variables) => {
					return payload.sharedTripEdited.id === variables.tripId;
				}
			),
		},
	},
};
