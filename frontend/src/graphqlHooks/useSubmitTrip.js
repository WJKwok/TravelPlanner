import React from 'react';
import { useMutation, gql } from '@apollo/client';

export const useSubmitTrip = (
	dispatch,
	setSnackMessage,
	authState,
	setTripId
) => {
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

				// writing to cache so that this query doesn't have to recall
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

	return submitTrip;
};

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
