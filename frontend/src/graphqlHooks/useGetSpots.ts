import { useContext } from 'react';

import { SpotContext } from 'Store';

import { useLazyQuery, gql } from '@apollo/client';
import { SPOT_DATA } from '../utils/graphql';

export const useGetSpots = () => {
	const { dispatch } = useContext(SpotContext);

	const [getSpots, { variables: variablesGetSpots }] = useLazyQuery(GET_SPOTS, {
		onCompleted({ getSpots }) {
			console.log('getSpots', getSpots);
			dispatch({
				type: 'SYNC_SHARED_TRIP',
				payload: {
					shouldAdd: variablesGetSpots?.shouldAdd,
					shouldRemove: variablesGetSpots?.shouldRemove,
					newLikedSpots: getSpots,
				},
			});
		},
	});

	return { getSpots };
};

const GET_SPOTS = gql`
	query getSpots($spotIds: [String]) {
		getSpots(spotIds: $spotIds) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;
