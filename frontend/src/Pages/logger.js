import React, { useContext, useEffect } from 'react';
import { SpotContext } from '../Store/SpotContext';

import CategoryChipBarWeb from '../Components/categoryChipBarWeb';
import ContentWithinMapWeb from '../Components/contentWithinMapWeb';
import AppBar from '../Components/appBar';
import { LoggingForm } from '../Components/loggingForm';

import { SPOT_DATA } from '../utils/graphql';

import { useQuery, gql } from '@apollo/client';

function Logger(props) {
	const guideId = props.match.params.guideBookId;
	const { spotState, dispatch } = useContext(SpotContext);

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
			dispatch({
				type: 'LOAD_GUIDE',
				payload: { guide: getAllSpotsForGuide.guide },
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

		console.log('main coordinates:', spotState.guide.coordinates);

		return (
			<ContentWithinMapWeb
				dragAndDroppable={false}
				key={columnId}
				boardId={columnId}
				spots={spots}
				coordinates={spotState.guide.coordinates}
				catBar={<CategoryChipBarWeb hideOnlyLikedButton={true} />}
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

	return (
		<>
			<AppBar offset={true} />
			{spotState.guide.id && renderSpotsBoard()}
			{spotState.guide.categories && <LoggingForm guide={spotState.guide} />}
		</>
	);
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

const GET_GUIDE = gql`
	query getGuide($guideId: ID!) {
		getGuide(guideId: $guideId) {
			id
			name
			city
			coordinates
			categories
		}
	}
`;

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
