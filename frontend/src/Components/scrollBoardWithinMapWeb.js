import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import GoogleMapWithScrollBoard from './googleMapWithScrollBoardWeb';
import DaySelectMenu from './daySelectMenu';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import { SpotCardBase } from './spotCardBaseWeb';
import { SidePanelCard } from './sidePanelCard';

const useStyles = makeStyles((theme) => ({
	cardsScroll: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: props.sidePanel ? 408 : 0,
		zIndex: 5,
		width: props.sidePanel ? 'calc(100vw - 408px)' : '100vw',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		padding: 10,
		// transition: 'left 200ms cubic-bezier(0.0,0.0,0.2,1)',
	}),
	toggleButton: {
		position: 'absolute',
		zIndex: 5,
		top: 100,
		left: '100%',
		backgroundColor: 'white',
		padding: 5,
	},
}));

function ScrollBoardWithinMap(props) {
	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);
	const { boardId, spots, coordinates, dragAndDroppable } = props;

	const [mouseOverCard, setMouseOverCard] = useState(undefined);
	const [clickedCard, setClickedCard] = useState(null);
	const [showSidePanel, setShowSidePanel] = useState(true);
	const styleProps = { sidePanel: !!clickedCard && showSidePanel };
	const classes = useStyles(styleProps);

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
		<>
			{/* <DaySelectMenu day={day} dayChangeHandler={setDay} /> */}
			<GoogleMapWithScrollBoard
				spots={spots}
				coordinates={coordinates}
				resizable={true}
				pinClicked={executeScroll}
				mouseOverCard={mouseOverCard}
				clickedCard={clickedCard}
			>
				{props.children}
				{clickedCard ? (
					<SidePanelCard spot={clickedCard} showSidePanel={showSidePanel}>
						<p
							className={classes.toggleButton}
							onClick={() => setShowSidePanel((prev) => !prev)}
						>
							Toggle
						</p>
					</SidePanelCard>
				) : null}
				<Droppable droppableId={boardId} direction="horizontal">
					{(provided) => (
						<div
							ref={(ref) => setRef(provided.innerRef, ref)}
							{...provided.droppableProps}
							className={classes.cardsScroll}
						>
							{spots.length > 0
								? spots.map((spot, index) => (
										<SpotCardBase
											key={spot.id}
											spot={spot}
											day={day}
											index={index}
											expanded={false}
											highlight={mouseOverCard === spot.id}
											mouseOver={(id) => setMouseOverCard(id)}
											dragAndDroppable={dragAndDroppable}
											cardClickedHandler={() => {
												setClickedCard(spot);
												setShowSidePanel(true);
											}}
										/>
								  ))
								: placeHolderText}
							<Paper className={classes.paddingRight} elevation={0} />
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</GoogleMapWithScrollBoard>
		</>
	);
}

export default ScrollBoardWithinMap;
