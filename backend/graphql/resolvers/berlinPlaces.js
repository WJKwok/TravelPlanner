const { BerlinPlace } = require('../../models/');

module.exports = {
	Query: {
		async getBerlinPlaces() {
			try {
				const berlinPlaces = await BerlinPlace.find();
				return berlinPlaces;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
