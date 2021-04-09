import moment from 'moment';
import { initialData } from './initial-data';

export const spotReducer = (state, action) => {
	switch (action.type) {
		case 'LOAD_GUIDE':
			const { guide } = action.payload;
			const loadedGuide = loadGuide(guide);
			console.log('loadedGuide', loadedGuide);
			return loadedGuide;
		case 'LOAD_MAP':
			const { map } = action.payload;
			const loadedMap = loadMap(state, map);
			const mapLoaded = {
				...loadedMap,
				unsavedChanges: false,
			};
			return mapLoaded;
		case 'NEW_CLICKED_CATEGORIES':
			const { newClickedCategories } = action.payload;
			const loadedNewClickedCategories = loadNewClickedCategories(
				state,
				newClickedCategories
			);
			return loadedNewClickedCategories;
		case 'HIGHLIGHT_EXISTING_ITEM':
			const { searchedItem } = action.payload;
			const highlightedSearchItem = highLightSearchItem(state, searchedItem);
			return highlightedSearchItem;
		case 'ADD_SEARCH_ITEM':
			const { newSearchItem } = action.payload;
			const newSearchAdded = addSearchItem(state, newSearchItem);
			console.log('newSearchitemstate: ', newSearchAdded);
			return newSearchAdded;
		case 'ADD_SPOTS':
			const { newSpots, category, spotToHighlightID } = action.payload;
			console.log('newSpots: ', newSpots);
			const newSpotsAdded = addNewSpots(
				state,
				newSpots,
				category,
				spotToHighlightID
			);
			console.log('newSpotsAdded: ', newSpotsAdded);
			return newSpotsAdded;
		case 'TRIP_SAVED':
			const tripSaved = {
				...state,
				unsavedChanges: false,
			};
			return tripSaved;
		case 'LIKE_TOGGLE':
			const { spotId } = action.payload;
			const updatedLikes = updateLikes(state, spotId);
			const likesChanged = {
				...updatedLikes,
				unsavedChanges: true,
			};
			return likesChanged;
		case 'LOAD_TRIP':
			const { trip } = action.payload;
			const loadedTrip = loadTrip(state, trip);
			const tripLoaded = {
				...loadedTrip,
				unsavedChanges: false,
			};
			return tripLoaded;
		case 'REORDER':
			const { newOrder } = action.payload;
			const reordered = {
				...newOrder,
				unsavedChanges: true,
			};
			console.log('Reordered: ', reordered);
			return reordered;
		case 'CHANGE_DATE':
			const { startDate, numberOfDays } = action.payload;
			const newDate = changeDateAndDays(state, startDate, numberOfDays);
			const dateChanged = {
				...newDate,
				unsavedChanges: true,
			};
			console.log('Date Changed: ', dateChanged);
			return dateChanged;
		default:
			return state;
	}
};

const loadGuide = (guide) => {
	const newState = {
		...initialData,
		guide,
		clickedCategories: [],
	};

	return newState;
};

const loadMap = (state, trip) => {
	let spots = {};
	const spotIds = [];
	trip.spotsArray.forEach((spot) => {
		spotIds.push(spot.id);
		if (trip.likedSpots.includes(spot.id)) {
			spots[spot.id] = {
				...spot,
				liked: true,
			};
		} else {
			spots[spot.id] = spot;
		}
	});

	const columns = {};
	columns['filtered-spots'] = {
		id: 'filtered-spots',
		title: 'filtered-spots',
		spotIds,
	};

	const newState = {
		...state,
		spots,
		columns: {
			...state.columns,
			['filtered-spots']: {
				id: 'filtered-spots',
				title: 'filtered-spots',
				spotIds,
			},
		},
		filteredBoard: ['filtered-spots'],
		guide: trip.guide,
		clickedCategories: [],
		queriedCategories: trip.categoriesInTrip,
	};

	return newState;
};

const loadNewClickedCategories = (state, newClickedCategories) => {
	const newState = {
		...state,
		clickedCategories: newClickedCategories,
	};

	return newState;
};

const addNewSpots = (state, newSpots, category, spotToHighlightID = '') => {
	let mappedSpots = {};
	let spotIds = [];
	for (var i = 0; i < newSpots.length; i++) {
		if (!(newSpots[i].id in state.spots)) {
			mappedSpots[newSpots[i].id] = newSpots[i];
			spotIds.push(newSpots[i].id);
		}
	}
	const newState = {
		...state,
		spots: {
			...state.spots,
			...mappedSpots,
		},
		columns: {
			...state.columns,
			'filtered-spots': {
				...state.columns['filtered-spots'],
				spotIds: [
					...new Set([...state.columns['filtered-spots'].spotIds, ...spotIds]),
				],
			},
		},
		queriedCategories: [...new Set([category, ...state.queriedCategories])],
		clickedCategories: [...new Set([category, ...state.clickedCategories])],
		spotToHighlightID,
	};

	return newState;
};

const addSearchItem = (state, newSearchItem) => {
	const searchItem = {};
	const itemId = newSearchItem.id;
	searchItem[itemId] = newSearchItem;
	const newState = {
		...state,
		spots: {
			...state.spots,
			...searchItem,
		},
		columns: {
			...state.columns,
			'filtered-spots': {
				...state.columns['filtered-spots'],
				spotIds: [...state.columns['filtered-spots'].spotIds, itemId],
			},
		},
		spotToHighlightID: newSearchItem.id,
		guide: {
			...state.guide,
			categories: [...new Set(['Searched', ...state.guide.categories])],
		},
		clickedCategories: [...new Set(['Searched', ...state.clickedCategories])],
	};

	return newState;
};

const highLightSearchItem = (state, searchedItem) => {
	const isItemAlreadyInView =
		state.clickedCategories.filter((cat) =>
			searchedItem.categories.includes(cat)
		).length > 0;
	if (isItemAlreadyInView) {
		const newState = {
			...state,
			spotToHighlightID: searchedItem.id,
		};

		return newState;
	} else {
		const categoriesIntersection = state.queriedCategories.filter((value) =>
			searchedItem.categories.includes(value)
		);
		const newState = {
			...state,
			spotToHighlightID: searchedItem.id,
			clickedCategories: [
				...new Set([categoriesIntersection[0], ...state.clickedCategories]),
			],
		};

		return newState;
	}

	const newState = {
		...state,
		spotToHighlightID: searchedItem.id,
		clickedCategories: [...new Set([searchedItem, ...state.clickedCategories])],
	};
};

const updateLikes = (state, spotId) => {
	const newLikeState = state.spots[spotId].liked
		? !state.spots[spotId].liked
		: true;

	const spotToToggle = {
		...state.spots[spotId],
		liked: newLikeState,
	};

	console.log('spotToToggle', spotToToggle);
	const newState = {
		...state,
		spots: {
			...state.spots,
			[spotId]: {
				...spotToToggle,
			},
		},
	};

	return newState;
};

const loadTrip = (state, trip) => {
	let spots = {};
	trip.spotsArray.forEach((spot) => {
		if (trip.likedSpots.includes(spot.id)) {
			spots[spot.id] = {
				...spot,
				liked: true,
			};
		} else {
			spots[spot.id] = spot;
		}
	});

	const columns = {};
	const dayBoard = [];
	columns['filtered-spots'] = {
		id: 'filtered-spots',
		title: 'filtered-spots',
		spotIds: trip.filteredSpots,
	};

	for (let i = 0; i < trip.dayLists.length; i++) {
		const day = `day${i + 1}`;
		dayBoard.push(day);
		columns[day] = {
			id: day,
			title: day,
			spotIds: trip.dayLists[i],
		};
	}

	const newState = {
		...state,
		spots,
		startDate: moment(trip.startDate),
		numberOfDays: trip.dayLists.length,
		destination: 'Berlin',
		columns,
		filteredBoard: ['filtered-spots'],
		dayBoard,
		categoriesInTrip: trip.categoriesInTrip,
	};

	console.log('load trip state: ', newState);
	return newState;
};

const changeDateAndDays = (state, startDate, numberOfDays) => {
	console.log('date changing (startDate):', startDate);
	console.log('date changing (numberOfDays):', numberOfDays);
	const previousNumberOfDays = state.numberOfDays;

	const dayBoard = [];
	for (var i = 0; i < numberOfDays; i++) {
		const title = `day${i + 1}`;
		dayBoard.push(title);
	}

	if (previousNumberOfDays > numberOfDays) {
		let disposedSpotIds = [];

		for (var d = previousNumberOfDays; d > numberOfDays; d--) {
			const dayKey = `day${d}`;
			disposedSpotIds = disposedSpotIds.concat(state.columns[dayKey].spotIds);
			delete state.columns[dayKey];
		}

		const newState = {
			...state,
			startDate,
			numberOfDays,
			columns: {
				...state.columns,
				'filtered-spots': {
					...state.columns['filtered-spots'],
					spotIds: [
						...state.columns['filtered-spots'].spotIds,
						...disposedSpotIds,
					],
				},
			},
			dayBoard,
		};

		return newState;
	} else if (previousNumberOfDays < numberOfDays) {
		//loop up from previousNumberOfDays to previousNumberOfDays+differenceInDays and add columns
		let newDayBoardObjects = {};
		for (var a = previousNumberOfDays + 1; a <= numberOfDays; a++) {
			newDayBoardObjects[`day${a}`] = {
				id: `day${a}`,
				title: `day${a}`,
				spotIds: [],
			};
		}

		const newState = {
			...state,
			startDate,
			numberOfDays,
			dayBoard,
			columns: {
				...state.columns,
				...newDayBoardObjects,
			},
		};
		return newState;
	} else {
		const newState = {
			...state,
			startDate,
		};
		return newState;
	}
};
