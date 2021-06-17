import { useContext } from 'react';

import { SnackBarContext } from '../Store/SnackBarContext';
import { SpotContext } from '../Store/SpotContext';

import { useLazyQuery, gql } from '@apollo/client';
import { SPOT_DATA } from '../utils/graphql';

import { useGetSpotsForCategory } from './useGetSpotsForCategory';
import { useGetGuideData } from './useGetGuideData';

export const useGetSpot = () => {
	const { setSnackMessage } = useContext(SnackBarContext);
	const { dispatch } = useContext(SpotContext);
	const { guideData } = useGetGuideData();

	const getSpotsForCategoryInGuide = useGetSpotsForCategory();

	const [getSpot, { variables: variablesGetSpot }] = useLazyQuery(GET_SPOT, {
		onCompleted({ getSpot }) {
			if (!getSpot) {
				dispatch({
					type: 'ADD_SEARCH_ITEM',
					payload: { newSearchItem: variablesGetSpot.searchedItem },
				});
				setSnackMessage({
					text: "Spot has been added in 'Searched' :)",
					code: 'Confirm',
				});
			} else {
				const itemCategory = getSpot.categories[0];
				getSpotsForCategoryInGuide({
					variables: {
						guideId: guideData.id,
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

	return getSpot;
};

const GET_SPOT = gql`
	query getSpot($guideId: ID!, $placeId: String!) {
		getSpot(guideId: $guideId, placeId: $placeId) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;
