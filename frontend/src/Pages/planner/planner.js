import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import { DragDropContext } from 'react-beautiful-dnd';
import moment from 'moment';

import CategoryChipBar, {
	currentlySelectedChips,
} from '../../Components/categoryChipBar/';
import { iconDict } from '../../Components/spotIcons';
import AppBar from '../../Components/appBar';
import SpotsBoard from '../../Components/spotsBoard';
import DayBoard from '../../Components/dayBoard';
import DatePicker from '../../Components/datePicker';
import PlaceAutoComplete from '../../Components/placeAutoComplete';
import { SpotContext } from '../../Store/SpotContext';
import { AuthContext } from '../../Store/AuthContext';
import { SnackBarContext } from '../../Store/SnackBarContext';

import AuthModal from '../../Components/AuthModal';
import ConfirmNavPrompt from '../../Components/confirmNavPrompt';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import { Image } from 'cloudinary-react';

const useStyles = makeStyles((theme) => ({
	headerImage: {
		position: 'relative',
		width: '100%',
		height: 200,
		marginBottom: 30,
	},
	searchDialogSize: {
		minHeight: 300,
		padding: '13px',
	},
	searchButton: {
		margin: '0px 0px 5px 0px',
		[theme.breakpoints.down(430)]: {
			margin: '0px 0px 10px 10px',
		},
	},
	searchAndChips: {
		position: 'absolute',
		bottom: -45,
		left: 0,
		right: 0,
		padding: 10,
		margin: '0 auto',
		alignItems: 'baseline',
		[theme.breakpoints.down(430)]: {
			padding: '10px 0px',
		},
	},
	dayBoardContainer: {
		display: 'flex',
		borderRadius: 5,
		padding: '10px 0px 20px 10px',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	dateAndSave: {
		display: 'flex',
		alignItems: 'center',
		padding: '0px 10px',
	},
	saveButton: {
		margin: '0 0 0 auto',
		// backgroundColor: 'grey',
		border: 'lightGrey solid 0.5px',
	},
}));

function Planner(props) {
	const { authState } = useContext(AuthContext);
	const { spotState, dispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const classes = useStyles();
	const [categoryChips, setCategoryChips] = useState([]);
	const [queriedVariables, setQueriedVariables] = useState(['Liked']);
	const [startedSearch, setStartedSearch] = useState(false);
	const [newSearchItem, setNewSearchItem] = useState({});
	const [tripId, setTripId] = useState(props.match.params.tripId);
	const [loaded, setLoaded] = useState(false);
	const [guideData, setGuideData] = useState({});
	const [registerOpen, setRegisterOpen] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const guideId = props.match.params.guideBookId;

	console.log('tripId :', tripId, guideId);
	console.log('user exists? ', authState);
	//temporary for testing
	console.log('props:', props);

	// const onUnload = e => {
	//   e.preventDefault();
	//   e.returnValue = '';
	//   console.log('unlaoding')
	// }
	// window.addEventListener("beforeunload", onUnload);

	useEffect(() => {
		//props.history.push('/trips')
		if (tripId === undefined) {
			dispatch({ type: 'CLEAR_STATE' });
		}

		//Check if guideId exist, is the same, else clear state

		// if (guideId === spotState.guideId) {
		//   console.log('it is the same guidebook!')
		//   return
		// }
		// console.log('is there guideid?', spotState.guideId)
		// if (!spotState.guideId){
		//   console.log("there's no guide Id!")
		//   dispatch({type:"SET_GUIDEID", payload:{guideId}})
		//   return
		// }
		// if (guideId !== spotState.guideId) {
		//   console.log('checking if guide the same:', spotState.guideId)
		//   dispatch({type:"CLEAR_STATE"})
		//   return
		// }
	}, []);

	useEffect(() => {
		if (startedSearch) {
			const searchChip = {
				key: 'Searched',
				label: 'Searched',
				icon: iconDict['Searched'],
				clicked: true,
			};

			const categoriesAndSearch = [searchChip, ...categoryChips];
			setCategoryChips(categoriesAndSearch);
		}
	}, [startedSearch]);

	console.log('queriedVariables: ', queriedVariables);

	useQuery(GET_GUIDE, {
		skip: tripId,
		onCompleted({ getGuide }) {
			console.log('guide: ', getGuide);
			getCategories(getGuide.categories);
			setGuideData(getGuide);
			setLoaded(true);
		},
		variables: {
			guideId,
		},
	});

	// const [getTrip] =
	useQuery(GET_TRIP, {
		skip: tripId === undefined,
		onCompleted({ getTrip: trip }) {
			//console.log(JSON.stringify(trip));
			console.log('get trip: ', trip);
			// categories in trip are clicked
			const hasGooglePlacesInTrip = trip.googlePlacesInTrip.length > 0;
			setQueriedVariables([
				...queriedVariables,
				...trip.categoriesInTrip,
				hasGooglePlacesInTrip ? 'Searched' : null,
			]);
			getCategories(trip.guide.categories, trip.categoriesInTrip);
			setGuideData(trip.guide);
			setLoaded(true);
			setStartedSearch(hasGooglePlacesInTrip);
			dispatch({ type: 'LOAD_TRIP', payload: { trip } });
		},
		onError(err) {
			console.log('GETTRIP error', err);
		},
		variables: { tripId },
	});

	const [getSpotsForCategoryInGuide, { variables }] = useLazyQuery(GET_SPOTS, {
		onCompleted({ getSpotsForCategoryInGuide }) {
			console.log('variables', variables);
			console.log('getSpotsForCategoryInGuide:', getSpotsForCategoryInGuide);
			dispatch({
				type: 'ADD_SPOTS',
				payload: { newSpots: getSpotsForCategoryInGuide },
			});
			if (getSpotsForCategoryInGuide.length > 0) {
				setQueriedVariables([...queriedVariables, variables.category]);
			}
		},
	});

	const [getSpot] = useLazyQuery(GET_SPOT, {
		onCompleted({ getSpot }) {
			//deconstruct from data
			if (!getSpot) {
				dispatch({ type: 'ADD_SEARCH_ITEM', payload: { newSearchItem } });
				setStartedSearch(true);
				setSnackMessage({
					text: "Spot has been added in 'Searched' :)",
					code: 'Confirm',
				});
				setQueriedVariables([...queriedVariables, 'Searched']);
			} else {
				const itemCategory = getSpot.categories[0];
				getSpotsForCategoryInGuide({
					variables: {
						guideId,
						category: itemCategory,
					},
				});
				setSnackMessage({
					text: `item is in ${itemCategory} :)`,
					code: 'Info',
				});
				chipClickedTrue(itemCategory);
			}
		},
	});

	const getCategories = (guideCategories, clickedCategories = []) => {
		let categories = guideCategories.map((category) => {
			console.log('getCategories', iconDict.Default);
			return {
				key: category,
				label: category,
				icon: iconDict[category] ? iconDict[category] : iconDict.Default,
				clicked: clickedCategories.includes(category) ? true : false,
			};
		});

		let likedCategory = {
			key: 'Liked',
			label: 'Liked',
			icon: iconDict['Liked'],
			clicked: false,
		};

		console.log('building chips... :', categories);
		setCategoryChips([...categories, likedCategory]);
	};

	const chipClickedTrue = (chipName) => {
		const chipsClone = [...categoryChips];
		const objectIndex = categoryChips.findIndex(
			(chip) => chip.key === chipName
		);
		chipsClone[objectIndex].clicked = true;
		setCategoryChips(chipsClone);
	};

	const toggleChipHandler = (clickedChip) => {
		const chipsClone = [...categoryChips];
		const objectIndex = categoryChips.findIndex(
			(chip) => chip.key === clickedChip.key
		);
		chipsClone[objectIndex].clicked = !categoryChips[objectIndex].clicked;
		setCategoryChips(chipsClone);

		if (
			chipsClone[objectIndex].clicked &&
			!queriedVariables.includes(clickedChip.label)
		) {
			console.log('querying:', clickedChip.label);
			getSpotsForCategoryInGuide({
				variables: {
					guideId,
					category: clickedChip.label,
				},
			});
		}
	};

	const searchedItemClicked = (searchedItem) => {
		setSearchModalOpen(false);
		for (var key in spotState.spots) {
			if (spotState.spots[key].place.id === searchedItem.id) {
				console.log('STOP DO NOT ADD');
				setSnackMessage({ text: 'Item already exists', code: 'Info' });
				return;
			}
		}

		const reshapedItem = {
			categories: ['Searched'],
			content: 'hello',
			guide: 'Searched',
			id: searchedItem.id,
			imgUrl: ['https://i.imgur.com/zbBglmB.jpg'],
			place: {
				id: searchedItem.id,
				location: [searchedItem.location.lat, searchedItem.location.lng],
				name: searchedItem.name,
				rating: searchedItem.rating,
				userRatingsTotal: searchedItem.userRatingsTotal,
				businessStatus: searchedItem.businessStatus,
				hours: searchedItem.hours,
			},
		};

		setNewSearchItem(reshapedItem);

		getSpot({
			variables: {
				guideId,
				placeId: searchedItem.id,
			},
		});
	};

	const [submitTrip] = useMutation(SUBMIT_TRIP, {
		onCompleted({ submitTrip }) {
			console.log(submitTrip);
			setTripId(submitTrip.id);
			dispatch({ type: 'TRIP_SAVED' });
			setSnackMessage({ text: 'Your trip has been saved:)', code: 'Confirm' });
		},
		update(proxy, result) {
			console.log('submitTrip result:', result);

			try {
				const data = proxy.readQuery({
					query: GET_USER_TRIPS,
					variables: {
						userId: authState.user.id,
					},
				});

				// writing to cache so that the query doesn't have to recall
				// for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
				proxy.writeQuery({
					query: GET_USER_TRIPS,
					variables: {
						userId: authState.user.id,
					},
					data: {
						getUserTrips: [...data.getUserTrips, result.data.submitTrip],
					},
				});
			} catch (err) {
				console.log('update cache error:', err);
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	const [editTrip] = useMutation(EDIT_TRIP, {
		onCompleted({ editTrip }) {
			console.log('Trip edited', editTrip);
			setTripId(editTrip.id);
			dispatch({ type: 'TRIP_SAVED' });
			setSnackMessage({ text: 'Your trip has been saved:)', code: 'Confirm' });
		},
		update(proxy, result) {
			try {
				const data = proxy.readQuery({
					query: GET_TRIP,
					variables: {
						tripId,
					},
				});

				// writing to cache so that the query doesn't have to recall
				// for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
				proxy.writeQuery({
					query: GET_TRIP,
					variables: {
						tripId,
					},
					data: {
						getTrip: {
							...data.getTrip,
							filteredSpots: spotState.columns['filtered-spots'].spotIds,
							spotsArray: Object.values(spotState.spots),
							categoriesInTrip: queriedVariables,
						},
					},
				});
			} catch (err) {
				console.log('update cache error:', err);
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	const saveItinerary = () => {
		const dayKeyArray = spotState.dayBoard;
		let categoriesInDayBoard = [];
		let googlePlacesInTrip = [];
		let daySpotsArray = [];

		for (let i = 0; i < dayKeyArray.length; i++) {
			daySpotsArray.push(spotState.columns[dayKeyArray[i]].spotIds);
		}

		const daySpotsArrayFlattened = daySpotsArray.flat();

		for (let j = 0; j < daySpotsArrayFlattened.length; j++) {
			const categories = spotState.spots[daySpotsArrayFlattened[j]].categories;

			const categoriesNotYetIncluded = categories.filter(
				(cat) => cat !== 'Searched' && !categoriesInDayBoard.includes(cat)
			);
			if (categories[0] === 'Searched') {
				googlePlacesInTrip.push(daySpotsArrayFlattened[j]);
			} else if (categoriesNotYetIncluded.length > 0) {
				categoriesInDayBoard.push.apply(
					categoriesInDayBoard,
					categoriesNotYetIncluded
				);
			}

			// if (categories[0] === 'Searched') {
			// 	googlePlacesInTrip.push(daySpotsArrayFlattened[j]);
			// } else if (!categoriesInDayBoard.includes(category)) {
			// 	categoriesInDayBoard.push(category);
			// }
		}

		const allspots = spotState.spots;
		const likedSpots = Object.keys(allspots).filter((id) => allspots[id].liked);
		const likedCategory = [];
		for (let k = 0; k < likedSpots.length; k++) {
			likedCategory.push.apply(
				likedCategory,
				allspots[likedSpots[k]].categories
			);
		}

		const categoriesInTrip = [
			...new Set([...likedCategory, ...categoriesInDayBoard]),
		];

		console.log('categoriesInTrip', categoriesInTrip);
		if (daySpotsArrayFlattened.length === 0 && likedSpots.length === 0) {
			setSnackMessage({
				text: 'Your itinerary is empty or you have no liked spots',
				code: 'Error',
			});
		} else {
			if (!tripId) {
				if (!authState.user) {
					setRegisterOpen(true);
					setSnackMessage({
						text: 'You have to be logged in to save itinerary',
						code: 'Error',
					});
					return;
				}
				submitTrip({
					variables: {
						guide: guideId,
						startDate: spotState.startDate.format('YYYY-MM-DD'),
						dayLists: daySpotsArray,
						categoriesInTrip,
						likedSpots,
						googlePlacesInTrip,
					},
				});
			} else {
				console.log(tripId);
				editTrip({
					variables: {
						tripId,
						startDate: spotState.startDate.format('YYYY-MM-DD'),
						dayLists: daySpotsArray,
						categoriesInTrip,
						likedSpots,
						googlePlacesInTrip,
					},
				});
			}
		}
	};

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const start = spotState.columns[source.droppableId];
		const finish = spotState.columns[destination.droppableId];

		//if moving within the same column
		if (start === finish) {
			//no reordering within spots
			if (start.id === 'filtered-spots') {
				return;
			}

			const column = spotState.columns[source.droppableId];
			const newspots = Array.from(column.spotIds);
			newspots.splice(source.index, 1);
			newspots.splice(destination.index, 0, draggableId);

			const newColumn = {
				...column,
				spotIds: newspots,
			};

			const newOrder = {
				...spotState,
				columns: {
					...spotState.columns,
					[newColumn.id]: newColumn,
				},
			};

			console.log('reording within same column', newOrder);
			dispatch({ type: 'REORDER', payload: { newOrder } });
			return;
		}

		//moving from one list to another

		let startspots = Array.from(start.spotIds);
		startspots = startspots.filter((el) => el != draggableId);
		const newStart = {
			...start,
			spotIds: startspots,
		};

		const finishspots = Array.from(finish.spotIds);
		finishspots.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			spotIds: finishspots,
		};

		const newOrder = {
			...spotState,
			columns: {
				...spotState.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish,
			},
		};

		console.log('moving to a different columns', newOrder);
		dispatch({ type: 'REORDER', payload: { newOrder } });
	};

	const renderSpotsBoard = () => {
		const columnId = spotState.filteredBoard[0];
		const column = spotState.columns[columnId];
		const unfilteredSpots = column.spotIds.map(
			(spotId) => spotState.spots[spotId]
		);

		const likedChipIndex = categoryChips.findIndex(
			(chip) => chip.key === 'Liked'
		);
		const isLikedChipClicked = categoryChips[likedChipIndex].clicked;

		const selectedCategories = currentlySelectedChips(categoryChips);
		const filteredSpots = unfilteredSpots.filter((spot) =>
			spot.categories.some((cat) => selectedCategories.includes(cat))
		);

		const likedSpots = unfilteredSpots.filter((spot) => spot.liked);
		const spots = isLikedChipClicked
			? [...new Set([...filteredSpots, ...likedSpots])]
			: filteredSpots;

		console.log('filtering spots: ', spots);

		return (
			<SpotsBoard
				dragAndDroppable={true}
				key={columnId}
				boardId={columnId}
				spots={spots}
				coordinates={guideData.coordinates}
			/>
		);
	};

	const placeAutoCompletePlaceHolderText = 'Google a place of interest 🙌';

	return loaded ? (
		<div>
			<AppBar offset={true} partnerLogo={guideData.logo} />
			<ConfirmNavPrompt
				when={spotState.unsavedChanges}
				navigate={(path) => props.history.push(path)}
			/>
			<Dialog
				open={searchModalOpen}
				onClose={() => setSearchModalOpen(false)}
				fullWidth={true}
			>
				<div className={classes.searchDialogSize}>
					<PlaceAutoComplete
						clickFunction={searchedItemClicked}
						city={guideData.city}
						coordinates={guideData.coordinates}
						placeHolderText={placeAutoCompletePlaceHolderText}
					/>
				</div>
			</Dialog>

			<CardMedia className={classes.headerImage} image={guideData.plannerImage}>
				<div className={classes.searchAndChips}>
					<Button
						className={classes.searchButton}
						variant="contained"
						color="primary"
						size="medium"
						data-testid="google-search-button"
						onClick={() => setSearchModalOpen(true)}
					>
						Search
					</Button>
					<CategoryChipBar
						categoryChips={categoryChips}
						toggleChipHandler={toggleChipHandler}
					/>
				</div>
			</CardMedia>

			<DragDropContext onDragEnd={onDragEnd}>
				<div>{renderSpotsBoard()}</div>
				<div className={classes.dateAndSave}>
					<DatePicker />
					<IconButton
						id="save"
						className={classes.saveButton}
						onClick={saveItinerary}
					>
						<SaveIcon />
					</IconButton>
					{/* <Button
						variant="outlined"
						color="primary"
						size="medium"
						className={classes.saveButton}
						startIcon={<SaveIcon />}
						onClick={saveItinerary}
						id="save"
					>
						Save
					</Button> */}
				</div>
				<div className={classes.dayBoardContainer}>
					{spotState.dayBoard.map((columnId, index) => {
						const column = spotState.columns[columnId];
						const spots = column.spotIds.map(
							(spotId) => spotState.spots[spotId]
						);
						let date = moment(spotState.startDate).add(index, 'days');

						return (
							<DayBoard
								key={columnId}
								boardId={columnId}
								date={date}
								spots={spots}
								coordinates={guideData.coordinates}
							/>
						);
					})}
				</div>
			</DragDropContext>
			<AuthModal
				registerOpen={registerOpen}
				setRegisterOpen={setRegisterOpen}
			/>
		</div>
	) : null;
}

const GET_TRIP = gql`
	query getTrip($tripId: ID!) {
		getTrip(tripId: $tripId) {
			id
			guide {
				name
				city
				coordinates
				categories
				plannerImage
			}
			startDate
			dayLists
			categoriesInTrip
			googlePlacesInTrip
			spotsArray {
				id
				guide
				place {
					id
					name
					rating
					userRatingsTotal
					location
					hours
					businessStatus
					internationalPhoneNumber
					website
				}
				categories
				imgUrl
				content
				date
				eventName
			}
			filteredSpots
			likedSpots
		}
	}
`;

const SUBMIT_TRIP = gql`
	mutation submitTrip(
		$guide: ID!
		$startDate: String!
		$dayLists: [[String]]!
		$categoriesInTrip: [String]!
		$likedSpots: [String]!
		$googlePlacesInTrip: [String]!
	) {
		submitTrip(
			guide: $guide
			startDate: $startDate
			dayLists: $dayLists
			categoriesInTrip: $categoriesInTrip
			likedSpots: $likedSpots
			googlePlacesInTrip: $googlePlacesInTrip
		) {
			id
		}
	}
`;

const EDIT_TRIP = gql`
	mutation editTrip(
		$tripId: ID!
		$startDate: String!
		$dayLists: [[String]]!
		$categoriesInTrip: [String]!
		$likedSpots: [String]!
		$googlePlacesInTrip: [String]!
	) {
		editTrip(
			tripId: $tripId
			startDate: $startDate
			dayLists: $dayLists
			categoriesInTrip: $categoriesInTrip
			likedSpots: $likedSpots
			googlePlacesInTrip: $googlePlacesInTrip
		) {
			id
			dayLists
			startDate
		}
	}
`;

const GET_USER_TRIPS = gql`
	query getUserTrips($userId: ID!) {
		getUserTrips(userId: $userId) {
			id
			guide {
				id
				coverImage
				city
			}
			dayLists
			startDate
		}
	}
`;

const GET_SPOT = gql`
	query getSpot($guideId: ID!, $placeId: String!) {
		getSpot(guideId: $guideId, placeId: $placeId) {
			id
			guide
			place {
				id
				name
				rating
				userRatingsTotal
				location
				address
				businessStatus
				hours
				internationalPhoneNumber
				website
			}
			imgUrl
			content
			categories
		}
	}
`;

const GET_SPOTS = gql`
	query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
		getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
			id
			guide
			place {
				id
				name
				rating
				userRatingsTotal
				location
				address
				businessStatus
				hours
				internationalPhoneNumber
				website
			}
			imgUrl
			content
			eventName
			date
			categories
		}
	}
`;

const GET_GUIDE = gql`
	query getGuide($guideId: ID!) {
		getGuide(guideId: $guideId) {
			name
			city
			coordinates
			categories
			plannerImage
			logo
		}
	}
`;

export default Planner;

/* to look up cache
import {client} from '../ApolloProvider';

const getFilteredData = () => {
  try {
    let freshFilteredData = []
    for (var i = 0; i < categoryChips.length; i ++){
          if (categoryChips[i].clicked){
          const cachedData = client.readQuery({
            query: GET_SPOTS,
            variables: {
                guideId,
                category : categoryChips[i].label}
          })
          freshFilteredData = freshFilteredData.concat(cachedData.getSpotsForCategoryInGuide)
        }
    }
    setFilteredData(freshFilteredData)
    let spots = {}
    let spotIds = [];
    for (var i = 0; i < freshFilteredData.length; i ++ ){
      spots[freshFilteredData[i].id] = freshFilteredData[i];
      spotIds.push(freshFilteredData[i].id)
    }
    orderState.spots = spots;
    orderState.columns["filtered-spots"].spotIds = spotIds
  } catch (err) {
    console.log(err)
  }
}
*/

/*
  <div className={classes.explanation}>
    <p>A sample Berlin guidebook implementation. Features:</p>
    <ul>
      <li>Filter categories as you like (except for 'cafe' - it's a dummy)</li>
      <li>Click on map pins to autoscroll to index cards</li>
      <li>Drag and drop cards to DayBoards below to plan your itinerary</li>
      <li>Number of dayboards will render according to Datepicker selection</li>
    </ul> 
  </div>
*/

// console.log(ObjectId.isValid(newSearchItem.id) && ObjectId(newSearchItem.id).toString() === newSearchItem.id)
