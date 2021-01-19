import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import SpotCard from './spotCard';
import GoogleMap from './googleMap';
import DaySelectMenu from './daySelectMenu';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		padding: '20px 10px',
		// minHeight: 300,
		// boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
		// padding: 10,
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
}));

function SpotsBoard(props) {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);
	const { boardId, spots, coordinates, dragAndDroppable } = props;

	const [mouseOverCard, setMouseOverCard] = useState(undefined);

	const [day, setDay] = useState(moment().startOf('date').day());

	let myref = useRef(null);
	const setRef = (dropRefFunction, ref) => {
		myref = ref;
		dropRefFunction(ref);
	};

	console.log('children spotcard', window.innerWidth);

	const cardWith = isMobile ? window.innerWidth * 0.75 : theme.cardWidth;
	console.log('cardWith', cardWith);
	const executeScroll = (index, key) => {
		const pixel = index * cardWith + 10;
		console.log('pixel', pixel);
		console.log('map marker:', key);
		myref.scrollLeft = pixel;
		setMouseOverCard(key);
	};

	const placeHolderText = (
		<p>Click on the category chips above 👆 to display cards.</p>
	);

	return (
		<Paper variant="outlined" data-testid="spots-board">
			<DaySelectMenu day={day} dayChangeHandler={setDay} />
			<Droppable droppableId={boardId} direction="horizontal">
				{(provided) => (
					<div
						ref={(ref) => setRef(provided.innerRef, ref)}
						{...provided.droppableProps}
						className={classes.root}
					>
						{spots.length > 0
							? spots.map((spot, index) => (
									<SpotCard
										key={spot.id}
										spot={spot}
										day={day}
										index={index}
										expanded={true}
										highlight={mouseOverCard === spot.id}
										mouseOver={(id) => setMouseOverCard(id)}
										dragAndDroppable={dragAndDroppable}
									/>
							  ))
							: placeHolderText}
						<Paper className={classes.paddingRight} elevation={0} />
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<GoogleMap
				coordinates={coordinates}
				spots={spots}
				pinClicked={executeScroll}
				mouseOverCard={mouseOverCard}
				resizable={true}
			/>
		</Paper>
	);
}

export default SpotsBoard;
