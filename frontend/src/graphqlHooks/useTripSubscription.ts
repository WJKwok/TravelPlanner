import { useSubscription, gql } from '@apollo/client';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SpotContext } from 'Store/SpotContext';
import { useGetSpots } from './useGetSpots';
import { useGetTrip } from './useGetTrip';

export const useTripSubscription = () => {
	let { tripId } = useParams();
	const { tripData } = useGetTrip();
	const { getSpots } = useGetSpots();

	const { spotState, dispatch } = useContext(SpotContext);
	const shouldSkipSubscription = tripData?.sharedWith.length === 0;

	const { data, loading } = useSubscription(TRIP_SUBSCRIPTION, {
		skip: shouldSkipSubscription,
		onSubscriptionData(opt) {
			const { shouldAddThatNeedToBeCalled, shouldAdd, shouldRemove } =
				getVariablesFromOptAndState(opt, spotState);

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
		},
		variables: { tripId },
	});

	return { data, loading };
};

const getVariablesFromOptAndState = (opt, spotState) => {
	const subscriptionLikedSpots =
		opt.subscriptionData.data.sharedTripEdited.likedSpots;
	const currentLikedSpots = spotState.columns['filtered-spots'].spotIds.filter(
		(spot) => spotState.spots[spot].liked
	);

	const shouldAdd = subscriptionLikedSpots.filter(
		(spot) => !currentLikedSpots.includes(spot)
	);
	const shouldRemove = currentLikedSpots.filter(
		(spot) => !subscriptionLikedSpots.includes(spot)
	);

	let shouldAddThatNeedToBeCalled: any[] = [];
	shouldAdd.forEach((spot) => {
		if (!spotState.columns['filtered-spots'].spotIds.includes(spot)) {
			shouldAddThatNeedToBeCalled.push(spot);
		}
	});

	// console.log({
	// 	subscriptionLikedSpots,
	// 	currentLikedSpots,
	// 	shouldAdd,
	// 	shouldAddThatNeedToBeCalled,
	// 	shouldRemove,
	// });

	return { shouldAddThatNeedToBeCalled, shouldAdd, shouldRemove };
};

const TRIP_SUBSCRIPTION = gql`
	subscription sharedTripEdited($tripId: ID!) {
		sharedTripEdited(tripId: $tripId) {
			likedSpots
			id
		}
	}
`;
