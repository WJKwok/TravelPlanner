import React, { useState } from 'react';

import AppBar from '../Components/appBar';
import SpotsBoard from '../Components/spotsBoard';
import { LoggingForm } from '../Components/loggingForm';
import { DragDropContext } from 'react-beautiful-dnd';

import CategoryChipBar, {
	currentlySelectedChips,
} from '../Components/categoryChipBar/';
import { iconDict } from '../Components/spotIcons';

import { useQuery, gql } from '@apollo/client';

function Logger(props) {
	const guideId = props.match.params.guideBookId;
	const [guide, setGuide] = useState({});

	const [mapCoordinates, setMapCoordinates] = useState([]);

	const { data: { getAllSpotsForGuide: allSpots } = [] } = useQuery(
		GET_ALL_SPOTS_IN_GUIDE,
		{
			variables: {
				guideId,
			},
		}
	);

	const [categoryChips, setCategoryChips] = useState([]);

	useQuery(GET_GUIDE, {
		onCompleted({ getGuide }) {
			console.log('guide: ', getGuide);
			setGuide(getGuide);
			getCategories(getGuide.categories, getGuide.categories);
			setMapCoordinates([...getGuide.coordinates]);
		},
		variables: {
			guideId,
		},
	});

	const getCategories = (guideCategories, clickedCategories = []) => {
		let categories = guideCategories.map((category) => {
			return {
				key: category,
				label: category,
				icon: iconDict[category] ? iconDict[category] : iconDict.Default,
				clicked: clickedCategories.includes(category) ? true : false,
			};
		});

		console.log('building chips... :', categories);
		setCategoryChips(categories);
	};

	const toggleChipHandler = (clickedChip) => {
		const chipsClone = [...categoryChips];
		const objectIndex = categoryChips.findIndex(
			(chip) => chip.key === clickedChip.key
		);
		chipsClone[objectIndex].clicked = !categoryChips[objectIndex].clicked;
		setCategoryChips(chipsClone);
	};

	const renderSpotsBoard = () => {
		const unfilteredSpots = allSpots;
		console.log('allSpots', allSpots);

		const selectedCategories = currentlySelectedChips(categoryChips);
		const filteredSpots = unfilteredSpots.filter((spot) =>
			spot.categories.some((cat) => selectedCategories.includes(cat))
		);

		return (
			<SpotsBoard
				dragAndDroppable={false}
				key={guideId}
				boardId={guideId}
				spots={filteredSpots}
				coordinates={mapCoordinates}
			/>
		);
	};

	const onDragEnd = (result) => {
		return;
	};

	return (
		<>
			<AppBar offset={true} />
			<DragDropContext onDragEnd={onDragEnd}>
				<CategoryChipBar
					categoryChips={categoryChips}
					toggleChipHandler={toggleChipHandler}
				/>
				{allSpots && renderSpotsBoard()}
			</DragDropContext>
			{guide.categories && <LoggingForm guide={guide} />}
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
			id
			guide
			place {
				id
				name
				rating
				userRatingsTotal
				location
				businessStatus
				address
				hours
			}
			categories
			imgUrl
			content
			eventName
			date
		}
	}
`;

export default Logger;
