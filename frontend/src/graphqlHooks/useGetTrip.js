import { useQuery, gql } from '@apollo/client';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SpotContext } from 'Store/SpotContext';
import { useHistory } from 'react-router-dom';

import { SPOT_DATA } from '../utils/graphql';

export const useGetTrip = () => {
	let { tripId } = useParams();
	const { dispatch } = useContext(SpotContext);

	const history = useHistory();

	const {
		loading,
		error,
		data: { getTrip: tripData } = {},
	} = useQuery(GET_TRIP, {
		// on submitTrip, tripId becomes defined.. so have to check for previous guideId
		// skip: tripId === undefined || !!spotState.guide.id,

		//but now that we're getting tripId from useParams and not set in the component
		skip: tripId === undefined,
		onCompleted({ getTrip: trip }) {
			console.log('get trip: ', trip);
			dispatch({ type: 'LOAD_MAP', payload: { map: trip } });
		},
		onError({ graphQLErrors, networkError }) {
			if (graphQLErrors[0].extensions?.code === 'FORBIDDEN') {
				console.log('forbidden byee!');
				history.push('/'); //TODO: return FORBIDDEN MSG
			}
		},
		variables: { tripId },
	});

	return { loading, error, tripData };
};

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
			sharedWith
		}
	}
	${SPOT_DATA}
`;
