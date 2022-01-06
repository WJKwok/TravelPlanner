const { Place } = require('../../models/');
const { getGooglePlaceForUpdate } = require('../../utils/googlePlaceApi');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
	Mutation: {
		async savePlace(
			_,
			{
				placeInput: {
					id,
					name,
					rating,
					userRatingsTotal,
					address,
					location,
					hours,
				},
			},
			context
		) {
			const user = checkAuth(context);
			if (!user.role || !user.role.includes('Guide Owner')) {
				throw new Error('Sorry, you are not authorised');
			}
			try {
				let place = await Place.findById(id);
				if (place) {
					return place;
				} else {
					const newPlace = new Place({
						_id: id,
						name,
						rating,
						userRatingsTotal,
						address,
						location,
						hours,
						updatedAt: new Date().toISOString(),
					});

					const submitted = await newPlace.save();
					return submitted;
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async updatePlaces() {
			let placeIds = await Place.find({}, 'id').exec();

			// making an array of promise
			const placesFromGoogle = placeIds.map((place) =>
				getGooglePlaceForUpdate(place.id)
			);

			//function for getting the data from fulfilled promises
			const placeLoop = async (promises) => {
				let places = [];
				for await (const resolvedPromise of promises) {
					places.push(resolvedPromise);
				}
				return places;
			};

			const updatedPlaces = await placeLoop(placesFromGoogle);

			const updatePlaceDocument = async (updatedPlace) => {
				let place = await Place.findById(updatedPlace.id);
				if (place) {
					place.name = updatedPlace.name;
					place.businessStatus = updatedPlace.businessStatus;
					place.rating = updatedPlace.rating;
					place.userRatingsTotal = updatedPlace.userRatingsTotal;
					place.address = updatedPlace.address;
					place.location = updatedPlace.location;
					place.hours = updatedPlace.hours;
					place.website = updatedPlace.website;
					place.internationalPhoneNumber =
						updatedPlace.internationalPhoneNumber;
					place.reviews = updatedPlace.reviews;
					place.updatedAt = new Date().toISOString();

					await place.save();
					return place;
				}
			};

			updatedPlaces.forEach((place) => updatePlaceDocument(place));
			/* const updatedDocumentsPromises = updatedPlaces.map(place => updatePlaceDocument(place))
            const updatedDocuments = await placeLoop(updatedDocumentsPromises) */

			return true;
		},
	},
};
