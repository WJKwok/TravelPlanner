const Spot = require('../../models/Spot');
const checkAuth = require('../../utils/checkAuth');

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
		async getAllSpotsForGuide(_, { guideId }) {
			try {
				const spots = await Spot.find({ guide: guideId }).populate('place');
				//console.log(spots);
				return spots;
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
					const newSpot = await spot.save();

					return newSpot;
				} else {
					console.log('nana');
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
					return newSpot;
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
