const { Guide } = require('../../models/');

module.exports = {
	Query: {
		async getGuides() {
			try {
				const guides = await Guide.find();
				return guides;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getGuide(_, { guideId }) {
			try {
				const guide = await Guide.findById(guideId);
				return guide;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};

/* if you wanna populate beyond one level
const guide = await Guide.findById(guideId).populate({
    path: 'spot',
    populate: { path: 'place'}
});
*/
