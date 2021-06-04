export const getSpotsFromState = (spotState) => {
	const columnId = spotState.filteredBoard[0];
	const column = spotState.columns[columnId];
	const unfilteredSpots = column.spotIds.map(
		(spotId) => spotState.spots[spotId]
	);

	const selectedCategories = spotState.clickedCategories;
	const filteredSpots = unfilteredSpots.filter((spot) =>
		spot.categories.some((cat) => selectedCategories.includes(cat))
	);

	const likedSpots = unfilteredSpots.filter((spot) => spot.liked);
	const spots = [...new Set([...filteredSpots, ...likedSpots])];

	return spots;
};
