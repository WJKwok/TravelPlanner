import React, { useRef, useState, useEffect, useContext } from 'react';
import { SpotContext } from 'Store';

import {
	ProfileIconButton,
	LeftButtonGroup,
	CategoryChipBar,
	SpotCardBaseMobile,
	SlideUpCard,
	GoogleMapWithScrollBoardMobile,
	DaySelectMenu,
} from 'Components';

import { getSpotsFromState } from 'utils/getSpotsFromState';

import moment from 'moment';
import debounce from 'lodash/debounce';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

const useStyles = makeStyles((theme) => ({
	categoryBar: {
		zIndex: 10,
		position: 'absolute',
		width: '100%',
		top: 0,
		left: 0,
	},
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
		paddingLeft: '3.5vw',
		// transition: 'left 200ms cubic-bezier(0.0,0.0,0.2,1)',
	}),
	toggleButton: {
		position: 'absolute',
		zIndex: 5,
		top: 16,
		left: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		color: 'black',
		padding: 5,
	},
	bottomBar: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: 0,
		zIndex: 5,
		width: '100vw',
	}),
	leftButtonGroup: {
		position: 'absolute',
		bottom: '100%',
		left: '5vw',
	},
	rightButtons: {
		position: 'absolute',
		bottom: '100%',
		right: '5vw',
	},
}));

export function ContentWithinMapMobile() {
	const { spotState } = useContext(SpotContext);
	const spots = getSpotsFromState(spotState);

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

	useEffect(() => {
		myref.current.scrollTo({
			//top: myref.current.top //which is undefined anws
			left: 0,
			behavior: 'smooth',
		});
	}, [spotState.clickedCategories.length]);

	const cardWithAndMargin = window.innerWidth * 0.93;

	useEffect(() => {
		if (spotState.spotToHighlightID) {
			const spotToHighlightIndex = spots.findIndex(
				(spot) => spot.id === spotState.spotToHighlightID
			);
			executeScroll(spotToHighlightIndex, spots[spotToHighlightIndex], false);
		}
	}, [spotState.spotToHighlightID]);

	const executeScroll = (index, spot) => {
		const pixel = index * cardWithAndMargin;
		console.log('pixel', pixel);
		console.log('map marker:', spot.id);
		myref.current.scrollTo({
			left: pixel,
		});
		// setMouseOverCard(spot.id);
		setClickedCard(spot);
	};

	const onCardsScroll = () => {
		console.log('scrolling:', myref.current);
		if (myref.current) {
			// console.log('scrolling', myref.current.top);
			const messyScroll = myref.current.scrollLeft;
			const cardIndex = Math.round(messyScroll / cardWithAndMargin);
			const straightenedScroll = cardIndex * cardWithAndMargin;
			myref.current.scrollTo({
				//top: myref.current.top //which is undefined anws
				left: straightenedScroll,
				behavior: 'smooth',
			});
			// setMouseOverCard(spots[cardIndex].id);
			setClickedCard(spots[cardIndex]);
		}
	};

	const placeHolderText = (
		<p>Click on the category chips above 👆 to display cards.</p>
	);

	return (
		<>
			{/* <DaySelectMenu day={day} dayChangeHandler={setDay} /> */}
			<GoogleMapWithScrollBoardMobile
				spots={spots}
				resizable={true}
				pinClicked={executeScroll}
				// mouseOverCard={mouseOverCard}
				clickedCard={clickedCard}
			>
				<div className={classes.categoryBar}>
					<CategoryChipBar />
				</div>
				{clickedCard ? (
					<SlideUpCard spotId={clickedCard.id} showSidePanel={showSidePanel}>
						<IconButton
							className={classes.toggleButton}
							onClick={() => setShowSidePanel((prev) => !prev)}
						>
							<ArrowBackOutlinedIcon />
						</IconButton>
					</SlideUpCard>
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
									<SpotCardBaseMobile
										key={spot.id}
										spot={spot}
										day={day}
										index={index}
										expanded={false}
										// highlight={clickedCard && clickedCard.id === spot.id}
										// mouseOver={(id) => setMouseOverCard(id)}
										cardClickedHandler={() => {
											setClickedCard(spot);
											setShowSidePanel(true);
										}}
									/>
							  ))
							: placeHolderText}
						<div
							style={{ height: '5px', minWidth: '3.5vw', clear: 'both' }}
						></div>
					</div>
					{/* )}
					</Droppable> */}
					<div className={classes.leftButtonGroup}>
						<LeftButtonGroup />
					</div>
					<div className={classes.rightButtons}>
						<ProfileIconButton />
					</div>
				</div>
			</GoogleMapWithScrollBoardMobile>
		</>
	);
}
