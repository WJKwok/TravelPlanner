import { useContext } from 'react';
import { useMutation, gql } from '@apollo/client';

import { SpotContext } from '../Store/SpotContext';
import { SnackBarContext } from '../Store/SnackBarContext';
import { SPOT_DATA } from '../utils/graphql';

export const useEditTrip = () => {
	const { dispatch, spotState } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const [editTrip] = useMutation(EDIT_TRIP, {
		onCompleted({ editTrip }) {
			console.log('Trip edited', editTrip);
			dispatch({ type: 'TRIP_SAVED' });
			setSnackMessage({ text: 'Your trip has been saved:)', code: 'Confirm' });
		},
		update(proxy, result) {
			const tripId = result.data.editTrip.id;
			try {
				const data = proxy.readQuery({
					query: GET_TRIP,
					variables: {
						tripId,
					},
				});

				//can't expect graphQL to update cache because editTrip resolver does not return filteredSpots and spotsArray
				proxy.writeQuery({
					query: GET_TRIP,
					variables: {
						tripId,
					},
					data: {
						getTrip: {
							...data.getTrip,
							filteredSpots: spotState.columns['filtered-spots'].spotIds,
							spotsArray: [...Object.values(spotState.spots)],
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

	return editTrip;
};

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
			likedSpots
			googlePlacesInTrip
			categoriesInTrip
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
