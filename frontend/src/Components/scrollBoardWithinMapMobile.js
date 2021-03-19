import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import GoogleMapWithScrollBoard from './googleMapWithScrollBoardMobile';
import DaySelectMenu from './daySelectMenu';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import { SpotCardBase } from './spotCardBaseMobile';
import { SidePanelCard } from './slideUpCard';
import debounce from 'lodash/debounce';

const useStyles = makeStyles((theme) => ({
	cardsScroll: (props) => ({
		// position: 'absolute',
		// bottom: 0,
		// left: props.sidePanel ? 408 : 0,
		// zIndex: 5,
		// width: props.sidePanel ? 'calc(100vw - 408px)' : '100vw',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		paddingLeft: '8vw',
		// transition: 'left 200ms cubic-bezier(0.0,0.0,0.2,1)',
	}),
	toggleButton: {
		position: 'absolute',
		zIndex: 5,
		top: 20,
		left: 20,
		backgroundColor: 'white',
		padding: 5,
	},
	bottomBar: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: 0,
		zIndex: 5,
		width: '100vw',
	}),
	gSearchButton: {
		position: 'absolute',
		bottom: '100%',
		left: '10vw',
	},
	rightPadding: {
		width: '8vw',
	},
}));

function ScrollBoardWithinMap(props) {
	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);
	const {
		boardId,
		spots,
		coordinates,
		dragAndDroppable,
		catBar,
		gSearchButton,
	} = props;

	const [mouseOverCard, setMouseOverCard] = useState(undefined);
	const [clickedCard, setClickedCard] = useState(null);
	const [showSidePanel, setShowSidePanel] = useState(false);
	const styleProps = { sidePanel: !!clickedCard && showSidePanel };
	const classes = useStyles(styleProps);

	const [day, setDay] = useState(moment().startOf('date').day());

	let myref = useRef(null);
	/* apparently with drag and drop there was a bug with ref being possibly null : / removing it helped but had to add '.current'
	// const setRef = (dropRefFunction, ref) => {
	// 	myref = ref;
	// 	dropRefFunction(ref);
	// };
	*/

	const cardWith = window.innerWidth * 0.84;
	const executeScroll = (index, spot) => {
		const pixel = index * cardWith;
		console.log('pixel', pixel);
		console.log('map marker:', spot.id);
		// myref.current.scrollLeft = pixel;
		myref.current.scrollTo({
			//top: myref.current.top //which is undefined anws
			left: pixel,
		});
		setMouseOverCard(spot.id);
		setClickedCard(spot);
	};

	const onCardsScroll = () => {
		console.log('scrolling:', myref.current);
		// console.log('scrolling', myref.current.top);
		const messyScroll = myref.current.scrollLeft;
		const cardIndex = Math.round(messyScroll / cardWith);
		const straightenedScroll = cardIndex * cardWith;
		myref.current.scrollTo({
			//top: myref.current.top //which is undefined anws
			left: straightenedScroll,
			behavior: 'smooth',
		});
		// setMouseOverCard(spots[cardIndex].id);
		setClickedCard(spots[cardIndex]);
		// console.log('spot name:', spots[cardIndex].place.name);
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
				{catBar}

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

				<div className={classes.bottomBar}>
					{/* <Droppable droppableId={boardId} direction="horizontal">
						{(provided) => ( */}
					<div
						// ref={(ref) => setRef(provided.innerRef, ref)}
						// {...provided.droppableProps}
						ref={myref}
						className={classes.cardsScroll}
						onScroll={debounce(onCardsScroll, 150)}
					>
						{spots.length > 0
							? spots.map((spot, index) => (
									<SpotCardBase
										key={spot.id}
										spot={spot}
										day={day}
										index={index}
										expanded={false}
										// highlight={clickedCard && clickedCard.id === spot.id}
										mouseOver={(id) => setMouseOverCard(id)}
										dragAndDroppable={dragAndDroppable}
										cardClickedHandler={() => {
											setClickedCard(spot);
											setShowSidePanel(true);
										}}
									/>
							  ))
							: placeHolderText}
						<div className={classes.rightPadding}>blank</div>
						{/* {provided.placeholder} */}
					</div>
					{/* )}
					</Droppable> */}
					<div className={classes.gSearchButton}>{gSearchButton}</div>
				</div>
			</GoogleMapWithScrollBoard>
		</>
	);
}

export default ScrollBoardWithinMap;
