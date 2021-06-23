import React, { useContext, useEffect } from 'react';

import { useQuery, gql } from '@apollo/client';
import { SPOT_DATA } from '../utils/graphql';
import { useGetGuideData } from 'graphqlHooks';

import { SpotContext } from 'Store';

import {
	CategoryChipBar,
	ContentWithinMapWeb,
	AppBar,
	LoggingForm,
} from 'Components';

function Logger(props) {
	const guideId = props.match.params.guideBookId;
	const { spotState, dispatch } = useContext(SpotContext);

	const { guideData } = useGetGuideData();

	useEffect(() => {
		return () => {
			console.log('clearing state...');
			dispatch({ type: 'CLEAR_STATE' });
		};
	}, [dispatch]);

	useQuery(GET_ALL_SPOTS_IN_GUIDE, {
		onCompleted({ getAllSpotsForGuide }) {
			console.log('getAllSpotsForGuide', getAllSpotsForGuide);
			dispatch({
				type: 'ADD_SPOTS',
				payload: {
					newSpots: getAllSpotsForGuide.spots,
					categories: getAllSpotsForGuide.guide.categories,
				},
			});
		},
		onError(err) {
			console.log(err);
		},
		variables: {
			guideId,
		},
	});

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

		console.log('main coordinates:', guideData.coordinates);

		return (
			<ContentWithinMapWeb
				isEditMode={true}
				key={columnId}
				boardId={columnId}
				spots={spots}
				coordinates={guideData.coordinates}
				catBar={<CategoryChipBar hideOnlyLikedButton={true} />}
				// leftButtonGroup={
				// 	<LeftButtonGroup
				// 		isLoggedIn={!authState.user}
				// 		isMobile={isMobile}
				// 		saveItinerary={saveItinerary}
				// 		setSearchModalOpen={setSearchModalOpen}
				// 		setIsListView={setIsListView}
				// 	/>
				// }
				// rightButtons={<ProfileIconButton />}
			/>
		);
	};

	console.log('spotstate', spotState);

	return guideData ? (
		<>
			<AppBar offset={true} />
			{guideData.id && renderSpotsBoard()}
			{guideData.categories && <LoggingForm guide={guideData} />}
		</>
	) : null;
}

/* 
if you type def is savePlace(placeInput: PlaceInput!): Place! <-- with an '!' after PlaceInput, you can't use this:

const SAVE_PLACE = gql`
    mutation savePlace(
        $placeInput: PlaceInput
    ){
        savePlace(
            placeInput: $placeInput
        ){
            name
        }
    }
`

With the '!' the playground will still work, but here it wont.
You have to use the below:
*/

const GET_ALL_SPOTS_IN_GUIDE = gql`
	query getAllSpotsForGuide($guideId: ID!) {
		getAllSpotsForGuide(guideId: $guideId) {
			guide {
				id
				name
				city
				coordinates
				categories
				plannerImage
			}
			spots {
				...SpotData
			}
		}
	}
	${SPOT_DATA}
`;

export default Logger;
