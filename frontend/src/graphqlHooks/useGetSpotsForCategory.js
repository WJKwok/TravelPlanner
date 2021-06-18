import { useContext } from 'react';

import { SpotContext } from 'Store';

import { useLazyQuery, gql } from '@apollo/client';
import { SPOT_DATA } from '../utils/graphql';

export const useGetSpotsForCategory = () => {
	const { dispatch } = useContext(SpotContext);

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

	return getSpotsForCategoryInGuide;
};

const GET_SPOTS_FOR_CATEGORY = gql`
	query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
		getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;
