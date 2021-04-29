import { Place } from '../types';

// "proxy": "https://maps.googleapis.com/maps/api",
const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
// const baseUrl = 'https://maps.googleapis.com/maps/api'
export const fetchPredictions = async (searchString, coordinates) => {
	const response = await fetch(
		`/place/autocomplete/json?input=${searchString}&types=establishment&location=${coordinates}&strictbounds&radius=50000&key=${googlePlacesApi}`
	);
	const data = await response.json();

	return data;
};

export const fetchOnePlaceId = async (placeId) => {
	const response = await fetch(
		`/place/details/json?placeid=${placeId}&key=${googlePlacesApi}`
	);

	const placeData = await response.json();
	const dataResult = placeData.result;

	let placeObject: Place = {
		id: placeId,
		name: dataResult.name,
		rating: dataResult.rating,
		userRatingsTotal: dataResult.user_ratings_total,
		// photoRef: dataResult.photos
		//   ? dataResult.photos[0].photo_reference
		//   : '0',
		location: dataResult.geometry.location,
		address: dataResult.formatted_address,
		businessStatus: dataResult.business_status,
		hours: dataResult.opening_hours
			? dataResult.opening_hours.weekday_text
			: null,
		website: dataResult.website,
		internationalPhoneNumber: dataResult.formatted_phone_number,
		reviews: JSON.stringify(dataResult.reviews),
	};

	return placeObject;
};

export const fetchCategories = async (categories, city, dispatch) => {
	dispatch({ type: 'LOAD_EMPTY_CATEGORY', payload: { categories } });

	for (var i = 0; i < categories.length; i++) {
		// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
		// added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"

		const response = await fetch(
			`/place/textsearch/json?query=best+${categories[i]}+${city}&key=${googlePlacesApi}`
		);
		const extraSuggestions = await response.json();

		dispatch({
			type: 'LOAD_CATEGORY',
			payload: { extraSuggestions, placeType: categories[i] },
		});
	}
};

export const fetchPlaceIdsDaybyDay = async (dayPlans, dispatch) => {
	for (var i = 0; i < dayPlans.length; i++) {
		let placesFetched = {};
		const placeIds = dayPlans[i].placeIds;

		for (var j = 0; j < placeIds.length; j++) {
			const response = await fetch(
				`/place/details/json?placeid=${placeIds[j]}&key=${googlePlacesApi}`
			);
			const placeData = await response.json();

			let placeObject = {};
			placeObject['id'] = placeIds[j];
			placeObject['content'] = placeData.result.name;
			placeObject['rating'] = placeData.result.rating;
			placeObject['photoRef'] = placeData.result.photos
				? placeData.result.photos[0].photo_reference
				: '0';
			placeObject['location'] = placeData.result.geometry.location;

			console.log(placeObject);
			placesFetched[placeIds[j]] = placeObject;
		}

		dispatch({
			type: 'LOAD_DAY_ITINERARY',
			payload: { day: i, placeIds, dayPlacesFetched: placesFetched },
		});
	}
};

export const fetchPlaceIds = async (dayPlans) => {
	let placesFetched = {};

	for (var i = 0; i < dayPlans.length; i++) {
		const placeIds = dayPlans[i].placeIds;

		for (var j = 0; j < placeIds.length; j++) {
			const response = await fetch(
				`/place/details/json?placeid=${placeIds[j]}&key=${googlePlacesApi}`
			);
			const placeData = await response.json();

			let placeObject = {};
			placeObject['id'] = placeIds[j];
			placeObject['content'] = placeData.result.name;
			placeObject['rating'] = placeData.result.rating;
			placeObject['photoRef'] = placeData.result.photos
				? placeData.result.photos[0].photo_reference
				: '0';
			placeObject['location'] = placeData.result.geometry.location;

			console.log(placeObject);
			placesFetched[placeIds[j]] = placeObject;
		}
	}

	return placesFetched;
};
