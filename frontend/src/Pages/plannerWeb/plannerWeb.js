import React, { useContext, useState, useEffect } from 'react';

import { SpotContext } from '../../Store/SpotContext';
import { AuthContext } from '../../Store/AuthContext';

import { useQuery, useLazyQuery, useSubscription, gql } from '@apollo/client';
import { SPOT_DATA } from '../../utils/graphql';

import { useSubmitTrip } from '../../graphqlHooks/useSubmitTrip';
import { useEditTrip } from '../../graphqlHooks/useEditTrip';

import ContentWithinMapWeb from '../../Components/contentWithinMapWeb';
import ContentWithinMapMobile from '../../Components/contentWithinMapMobile';
import { ListPage } from 'Components/listPage';
import ConfirmNavPrompt from '../../Components/confirmNavPrompt';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Planner(props) {
	const { authState } = useContext(AuthContext);
	const { spotState, dispatch } = useContext(SpotContext);

	const [tripId, setTripId] = useState(props.match.params.tripId);

	const guideId = props.match.params.guideBookId;

	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);

	const submitTrip = useSubmitTrip(setTripId);
	const editTrip = useEditTrip(tripId);

	useEffect(() => {
		return () => {
			console.log('clearing state...');
			dispatch({ type: 'CLEAR_STATE' });
		};
	}, [dispatch]);

	useEffect(() => {
		console.log(
			'save after login',
			spotState.recentLikeToggledSpotId,
			authState.user
		);
		if (spotState.recentLikeToggledSpotId && authState.user) {
			saveItinerary();
		}
	}, [spotState.recentLikeToggledSpotId, authState.user]);

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
		// on submitTrip, tripId becomes defined.. so have to check for previous guideId
		skip: tripId === undefined || !!spotState.guide.id,
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
		if (!tripId) {
			submitTrip();
		} else {
			editTrip();
		}
	};

	const renderSpotsBoard = () => {
		if (isMobile) {
			if (spotState.view === 'LIST') {
				return <ListPage />;
			} else {
				return <ContentWithinMapMobile />;
			}
		}
		return <ContentWithinMapWeb />;
	};

	return spotState.guide.id ? (
		<>
			<ConfirmNavPrompt
				when={spotState.unsavedChanges === true}
				navigate={(path) => props.history.push(path)}
			/>
			<div>{renderSpotsBoard()}</div>
		</>
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

const GET_SPOTS = gql`
	query getSpots($spotIds: [String]) {
		getSpots(spotIds: $spotIds) {
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
