import React, { useContext, useState, useEffect } from 'react';

import { SpotContext } from '../../Store/SpotContext';
import { AuthContext } from '../../Store/AuthContext';
import { SnackBarContext } from '../../Store/SnackBarContext';

import { useQuery, useLazyQuery, useSubscription, gql } from '@apollo/client';
import { SPOT_DATA } from '../../utils/graphql';

import { useSubmitTrip } from '../../graphqlHooks/useSubmitTrip';
import { useEditTrip } from '../../graphqlHooks/useEditTrip';

import CategoryChipBar from '../../Components/categoryChipBarWeb';
import ContentWithinMapWeb from '../../Components/contentWithinMapWeb';
import ContentWithinMapMobile from '../../Components/contentWithinMapMobile';
import { ListPage } from 'Components/listPage';
import AuthModal from '../../Components/AuthModal';
import ConfirmNavPrompt from '../../Components/confirmNavPrompt';
import ProfileIconButton from '../../Components/profileIconButton';
import PlaceAutoComplete from '../../Components/placeAutoComplete';
import { LeftButtonGroup } from '../../Components/leftButtonGroup';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
	searchDialogSize: {
		minHeight: 300,
		padding: '13px',
	},
}));

function Planner(props) {
	const { authState } = useContext(AuthContext);
	const { spotState, dispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const classes = useStyles();
	const [newSearchItem, setNewSearchItem] = useState({});
	const [tripId, setTripId] = useState(props.match.params.tripId);

	const [registerOpen, setRegisterOpen] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [isListView, setIsListView] = useState(false);

	const guideId = props.match.params.guideBookId;

	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);

	const submitTrip = useSubmitTrip(setTripId);
	const editTrip = useEditTrip();

	useEffect(() => {
		return () => {
			console.log('clearing state...');
			dispatch({ type: 'CLEAR_STATE' });
		};
	}, [dispatch]);

	useEffect(() => {
		if (spotState.recentLikeToggledSpotId && authState.user) {
			saveItinerary();
		}
	}, [spotState.recentLikeToggledSpotId]);

	useQuery(GET_GUIDE, {
		skip: tripId,
		onCompleted({ getGuide }) {
			dispatch({ type: 'LOAD_GUIDE', payload: { guide: getGuide } });
		},
		variables: {
			guideId,
		},
	});

	useQuery(GET_TRIP, {
		skip: tripId === undefined || spotState.guide.id !== undefined,
		onCompleted({ getTrip: trip }) {
			console.log('get trip: ', trip);
			dispatch({ type: 'LOAD_MAP', payload: { map: trip } });
		},
		onError({ graphQLErrors, networkError }) {
			if (graphQLErrors[0].extensions.code === 'FORBIDDEN') {
				console.log('forbidden byee!');
				props.history.push('/'); //TODO: return FORBIDDEN MSG
			}
		},
		variables: { tripId },
	});

	const [getSpotsForCategoryInGuide, { variables }] = useLazyQuery(
		GET_SPOTS_FOR_CATEGORY,
		{
			onCompleted({ getSpotsForCategoryInGuide }) {
				dispatch({
					type: 'ADD_SPOTS',
					payload: {
						newSpots: getSpotsForCategoryInGuide,
						categories: [variables.category],
						spotToHighlightID: variables.itemId,
					},
				});
			},
		}
	);

	const [getSpot] = useLazyQuery(GET_SPOT, {
		onCompleted({ getSpot }) {
			if (!getSpot) {
				dispatch({ type: 'ADD_SEARCH_ITEM', payload: { newSearchItem } });
				setSnackMessage({
					text: "Spot has been added in 'Searched' :)",
					code: 'Confirm',
				});
			} else {
				const itemCategory = getSpot.categories[0];
				getSpotsForCategoryInGuide({
					variables: {
						guideId,
						category: itemCategory,
						itemId: getSpot.id,
					},
				});
				setSnackMessage({
					text: `item is in ${itemCategory} :)`,
					code: 'Info',
				});
				// chipClickedTrue(itemCategory); //TODO:
			}
		},
	});

	const [getSpots, { variables: variablesGetSpots }] = useLazyQuery(GET_SPOTS, {
		onCompleted({ getSpots }) {
			console.log('getSpots', getSpots);
			dispatch({
				type: 'SYNC_SHARED_TRIP',
				payload: {
					shouldAdd: variablesGetSpots.shouldAdd,
					shouldRemove: variablesGetSpots.shouldRemove,
					newLikedSpots: getSpots,
				},
			});
		},
	});

	const { data, loading } = useSubscription(TRIP_SUBSCRIPTION, {
		skip: tripId === undefined,
		onSubscriptionData(opt) {
			const subscriptionLikedSpots =
				opt.subscriptionData.data.sharedTripEdited.likedSpots;
			const currentLikedSpots = spotState.columns[
				'filtered-spots'
			].spotIds.filter((spot) => spotState.spots[spot].liked);

			const shouldAdd = subscriptionLikedSpots.filter(
				(spot) => !currentLikedSpots.includes(spot)
			);
			const shouldRemove = currentLikedSpots.filter(
				(spot) => !subscriptionLikedSpots.includes(spot)
			);

			const shouldAddThatNeedToBeCalled = [];
			shouldAdd.forEach((spot) => {
				if (!spotState.columns['filtered-spots'].spotIds.includes(spot)) {
					shouldAddThatNeedToBeCalled.push(spot);
				}
			});

			if (shouldAddThatNeedToBeCalled.length === 0) {
				dispatch({
					type: 'SYNC_SHARED_TRIP',
					payload: { shouldAdd, shouldRemove },
				});
			} else {
				getSpots({
					variables: {
						spotIds: shouldAddThatNeedToBeCalled,
						shouldAdd,
						shouldRemove,
					},
				});
			}

			console.log({
				subscriptionLikedSpots,
				currentLikedSpots,
				shouldAdd,
				shouldAddThatNeedToBeCalled,
				shouldRemove,
			});
		},
		variables: { tripId },
	});

	const saveItinerary = () => {
		console.log('spotState:', spotState);

		let googlePlacesInTrip = [];
		let daySpotsArray = [[]];

		const allspots = spotState.spots;
		const likedSpots = Object.keys(allspots).filter((id) => allspots[id].liked);
		const likedCategory = [];
		for (let k = 0; k < likedSpots.length; k++) {
			likedCategory.push.apply(
				likedCategory,
				allspots[likedSpots[k]].categories
			);
			if (spotState.spots[likedSpots[k]].categories[0] === 'Searched') {
				googlePlacesInTrip.push(likedSpots[k]);
			}
		}

		const categoriesInTrip = [...new Set(likedCategory)];
		console.log({ likedCategory, categoriesInTrip });

		if (likedSpots.length === 0) {
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
				console.log('trip is edited', tripId);
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

	const searchedItemClicked = (searchedItem) => {
		setSearchModalOpen(false);
		for (var key in spotState.spots) {
			if (spotState.spots[key].place.id === searchedItem.id) {
				console.log('STOP DO NOT ADD');
				dispatch({
					type: 'HIGHLIGHT_EXISTING_ITEM',
					payload: { searchedItem: spotState.spots[key] },
				});
				setSnackMessage({ text: 'Item already exists', code: 'Info' });
				return;
			}
		}

		const reshapedItem = {
			__typename: 'Spot',
			categories: ['Searched'],
			content: '',
			guide: 'Searched',
			id: searchedItem.id,
			imgUrl: ['https://i.imgur.com/zbBglmB.jpg'],
			place: {
				__typename: 'Place',
				id: searchedItem.id,
				location: [searchedItem.location.lat, searchedItem.location.lng],
				name: searchedItem.name,
				rating: searchedItem.rating,
				userRatingsTotal: searchedItem.userRatingsTotal,
				businessStatus: searchedItem.businessStatus,
				hours: searchedItem.hours,
				reviews: searchedItem.reviews,
				internationalPhoneNumber: searchedItem.internationalPhoneNumber,
				website: searchedItem.website,
				address: searchedItem.address,
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

	const renderSpotsBoard = () => {
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

		console.log('filtering spots: ', spots);
		console.log('main coordinates:', spotState.guide.coordinates);

		if (isMobile) {
			if (isListView) {
				return (
					<ListPage
						spots={spots}
						catBar={<CategoryChipBar />}
						setIsListView={setIsListView}
					/>
				);
			} else {
				return (
					<ContentWithinMapMobile
						dragAndDroppable={true}
						key={columnId}
						boardId={columnId}
						spots={spots}
						coordinates={spotState.guide.coordinates}
						catBar={<CategoryChipBar />}
						leftButtonGroup={
							<LeftButtonGroup
								isLoggedIn={!authState.user}
								isMobile={isMobile}
								saveItinerary={saveItinerary}
								setSearchModalOpen={setSearchModalOpen}
								setIsListView={setIsListView}
							/>
						}
						rightButtons={<ProfileIconButton />}
					/>
				);
			}
		}
		return (
			<ContentWithinMapWeb
				dragAndDroppable={true}
				key={columnId}
				boardId={columnId}
				spots={spots}
				coordinates={spotState.guide.coordinates}
				catBar={<CategoryChipBar />}
				leftButtonGroup={
					<LeftButtonGroup
						isLoggedIn={!authState.user}
						isMobile={isMobile}
						saveItinerary={saveItinerary}
						setSearchModalOpen={setSearchModalOpen}
						setIsListView={setIsListView}
					/>
				}
				rightButtons={<ProfileIconButton />}
			/>
		);
	};

	const placeAutoCompletePlaceHolderText = 'Google a place of interest 🙌';
	console.log('unsaved web?', spotState.unsavedChanges);

	return spotState.guide.id ? (
		<div>
			<ConfirmNavPrompt
				when={spotState.unsavedChanges === true}
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
						city={spotState.guide.city}
						coordinates={spotState.guide.coordinates}
						placeHolderText={placeAutoCompletePlaceHolderText}
					/>
				</div>
			</Dialog>

			<div>{renderSpotsBoard()}</div>
			<AuthModal
				registerOpen={registerOpen}
				setRegisterOpen={setRegisterOpen}
			/>
		</div>
	) : null;
}

const GET_GUIDE = gql`
	query getGuide($guideId: ID!) {
		getGuide(guideId: $guideId) {
			id
			name
			city
			coordinates
			categories
			plannerImage
			logo
		}
	}
`;

const GET_TRIP = gql`
	query getTrip($tripId: ID!) {
		getTrip(tripId: $tripId) {
			id
			guide {
				id
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
				...SpotData
			}
			filteredSpots
			likedSpots
		}
	}
	${SPOT_DATA}
`;

const GET_SPOT = gql`
	query getSpot($guideId: ID!, $placeId: String!) {
		getSpot(guideId: $guideId, placeId: $placeId) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;

const GET_SPOTS = gql`
	query getSpots($spotIds: [String]) {
		getSpots(spotIds: $spotIds) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;

const GET_SPOTS_FOR_CATEGORY = gql`
	query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
		getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;

const TRIP_SUBSCRIPTION = gql`
	subscription sharedTripEdited($tripId: ID!) {
		sharedTripEdited(tripId: $tripId) {
			likedSpots
			id
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
            query: GET_SPOTS_FOR_CATEGORY,
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
