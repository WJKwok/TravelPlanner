const Spot = require('../../models/Spot');
const Place = require('../../models/Place');
const Guide = require('../../models/Guide');
const checkAuth = require('../../utils/checkAuth');
const { getGooglePlace } = require('../../utils/googlePlaceApi');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	Query: {
		async getSpot(_, { guideId, placeId }) {
			try {
				const spot = await Spot.findOne({
					guide: guideId,
					place: placeId,
				}).populate('place');
				// console.log(spot);
				return spot;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getSpots(_, { spotIds }) {
			// split array into google place and spots

			const googlePlaces = [];
			const guideSpots = [];
			spotIds.forEach((id) => {
				console.log('id', id);
				if (ObjectId.isValid(id) && ObjectId(id).toString() === id) {
					guideSpots.push(id);
				} else {
					googlePlaces.push(id);
				}
			});

			// await places and spots
			const placesFromGoogle = await Promise.all(
				googlePlaces.map((placeId) => getGooglePlace(placeId))
			);
			const spotsFromGuide = await Promise.all(
				guideSpots.map((spotId) => Spot.findById(spotId).populate('place'))
			);

			// return both with liked: true
			console.log('getspots', [...placesFromGoogle, ...spotsFromGuide]);
			return [...placesFromGoogle, ...spotsFromGuide];
		},
		async getAllSpotsForGuide(_, { guideId }) {
			try {
				const guide = await Guide.findById(guideId);
				const spots = await Spot.find({ guide: guideId }).populate('place');
				//console.log(spots);
				return {
					guide,
					spots,
				};
			} catch (err) {
				throw new Error(err);
			}
		},
		async getSpotsForCategoryInGuide(_, { guideId, category }) {
			try {
				const spots = await Spot.find({
					guide: guideId,
					categories: category,
				}).populate('place');
				//console.log(spots);
				return spots;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async editSchemaOfSpots() {
			// await Spot.updateMany({ $unset: { randomData: '' } });
			const spots = await Spot.find();
			const promises = [];
			spots.forEach((spot) => {
				spot.categories = [spot.category];
				promises.push(spot.save());
			});
			const editedspots = await Promise.all(promises);
			console.log(editedspots);
			return true;
		},
		async saveSpot(
			_,
			{
				spotInput: {
					guide,
					place,
					categories,
					imgUrl,
					content,
					date,
					eventName,
				},
				placeInput: {
					id,
					name,
					rating,
					userRatingsTotal,
					address,
					location,
					businessStatus,
					hours,
					internationalPhoneNumber,
					website,
				},
			},
			context
		) {
			const user = checkAuth(context);

			if (!user.role || !user.role.includes('Guide Owner')) {
				throw new Error('Sorry, you are not authorised');
			}
			try {
				let spot = await Spot.findOne({ guide, place });
				if (spot) {
					spot.categories = categories;
					spot.imgUrl = imgUrl;
					spot.content = content;
					spot.date = date;
					spot.eventName = eventName;
					const newSpot = await spot
						.save()
						.then((t) => t.populate('place').execPopulate());
					return newSpot;
				} else {
					console.log('nana');

					const newPlace = new Place({
						_id: id,
						name,
						rating,
						userRatingsTotal,
						address,
						location,
						hours,
						businessStatus,
						internationalPhoneNumber,
						website,
						updatedAt: new Date().toISOString(),
					});

					await newPlace.save();

					const newSpot = new Spot({
						guide,
						place,
						categories,
						imgUrl,
						content,
						date,
						eventName,
					});

					await newSpot.save();
					const result = {
						...newSpot.toObject({ virtuals: true }),
						place: {
							...newPlace.toObject({ virtuals: true }),
						},
					};
					// console.log('save place and spot', result);
					return result;
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
