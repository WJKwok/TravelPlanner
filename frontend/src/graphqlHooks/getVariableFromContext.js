export const getVariableFromContext = (spotState) => {
	let googlePlacesInTrip = [];
	let daySpotsArray = [[]];

	const allspots = spotState.spots;
	const likedSpots = Object.keys(allspots).filter((id) => allspots[id].liked);
	const likedCategory = [];
	for (let k = 0; k < likedSpots.length; k++) {
		likedCategory.push.apply(likedCategory, allspots[likedSpots[k]].categories);
		if (spotState.spots[likedSpots[k]].categories[0] === 'Searched') {
			googlePlacesInTrip.push(likedSpots[k]);
		}
	}

	const categoriesInTrip = [...new Set(likedCategory)];

	return {
		daySpotsArray,
		categoriesInTrip,
		likedSpots,
		googlePlacesInTrip,
	};
};
