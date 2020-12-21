const Spot = require('../../models/Spot');
const Place = require('../../models/Place');

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
				const spots = await Spot.find({ guide: guideId, category }).populate(
					'place'
				);
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
			spots.forEach((spot) => {
				console.log('spot:', spot);
				Spot.update({ _id: spot._id }, { $set: { imgUrl: [spot.imgUrl] } });
			});
			return true;
		},
		async saveSpot(
			_,
			{
				spotInput: { guide, place, category, imgUrl, content, date, eventName },
			}
		) {
			console.log(guide, place);
			try {
				let spot = await Spot.findOne({ guide, place });
				if (spot) {
					console.log('yay');
					console.log(spot);
					return spot;
				} else {
					console.log('nana');
					const newSpot = new Spot({
						guide,
						place,
						category,
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
