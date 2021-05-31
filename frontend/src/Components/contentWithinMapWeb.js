import React, { useRef, useState, useEffect, useContext } from 'react';
import { SpotContext } from '../Store/SpotContext';

import moment from 'moment';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import GoogleMapWithScrollBoard from './googleMapWeb';
import DaySelectMenu from './daySelectMenu';
import { SpotCardBase } from './spotCardBaseWeb';
import { SidePanelCard } from './sidePanelCard';

const useStyles = makeStyles((theme) => ({
	categoryBar: {
		zIndex: 10,
		position: 'absolute',
		width: '100%',
		top: 0,
		left: 0,
	},
	bottomBar: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: props.isSidePanelOpen ? 408 : 0,
		zIndex: 5,
		width: props.isSidePanelOpen ? 'calc(100vw - 408px)' : '100vw',
	}),
	cardsScroll: {
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		padding: 10,
	},
	leftButtons: {
		position: 'absolute',
		bottom: '100%',
		left: 15,
	},
	rightButtons: {
		position: 'absolute',
		bottom: '100%',
		right: 15,
	},
}));

function ContentWithinMapWeb(props) {
	const theme = useTheme();
	const {
		boardId,
		spots,
		coordinates,
		dragAndDroppable,
		catBar,
		leftButtonGroup,
		rightButtons,
	} = props;

	const { spotState } = useContext(SpotContext);

	const [mouseOverCard, setMouseOverCard] = useState(undefined);
	const [clickedCard, setClickedCard] = useState(null);
	const [showSidePanel, setShowSidePanel] = useState(false);
	const [day, setDay] = useState(moment().startOf('date').day());

	const styleProps = { isSidePanelOpen: !!clickedCard && showSidePanel };
	const classes = useStyles(styleProps);

	let cardsDivRef = useRef(null);

	useEffect(() => {
		if (cardsDivRef.current) {
			cardsDivRef.current.scrollTo({
				//top: cardsDivRef.current.top //which is undefined anws
				left: 0,
				behavior: 'smooth',
			});
		}
	}, [spotState.clickedCategories.length]);

	useEffect(() => {
		if (spotState.spotToHighlightID) {
			const spotToHighlightIndex = spots.findIndex(
				(spot) => spot.id === spotState.spotToHighlightID
			);
			executeScroll(spotToHighlightIndex, spots[spotToHighlightIndex], false);
		}
	}, [spotState.spotToHighlightID]);

	const executeScroll = (index, spot, showSidePanel = true) => {
		const cardWith = theme.cardWidth;
		const pixel = index * (cardWith + 10) + 10 - 15;
		cardsDivRef.current.scrollLeft = pixel;

		setMouseOverCard(spot.id);
		setClickedCard(spot);
		setShowSidePanel(showSidePanel);
	};

	const placeHolderText = (
		<p>Click on the category chips above 👆 to display cards.</p>
	);

	return (
		<GoogleMapWithScrollBoard
			spots={spots}
			coordinates={coordinates}
			resizable={true}
			pinClicked={executeScroll}
			mouseOverCard={mouseOverCard}
			clickedCard={clickedCard}
			showSidePanel={showSidePanel && clickedCard}
		>
			<div className={classes.categoryBar}>{catBar}</div>
			<SidePanelCard
				spotId={clickedCard?.id}
				showSidePanel={showSidePanel}
				onToggleSidePanelButtonClicked={() => setShowSidePanel((prev) => !prev)}
			/>
			<div className={classes.bottomBar}>
				<div
					ref={cardsDivRef}
					className={classes.cardsScroll}
					data-testid="bottom-bar-cards"
				>
					{spots.length > 0
						? spots.map((spot, index) => (
								<SpotCardBase
									key={spot.id}
									spot={spot}
									day={day}
									index={index}
									highlight={clickedCard?.id === spot.id}
									mouseOver={(id) => setMouseOverCard(id)}
									dragAndDroppable={dragAndDroppable}
									cardClickedHandler={() => {
										setClickedCard(spot);
										setShowSidePanel(true);
									}}
								/>
						  ))
						: placeHolderText}
					<div style={{ height: '5px', minWidth: '10px', clear: 'both' }}></div>
				</div>
				<div className={classes.leftButtons}>{leftButtonGroup}</div>
				<div className={classes.rightButtons}>{rightButtons}</div>
			</div>
		</GoogleMapWithScrollBoard>
	);
}

export default ContentWithinMapWeb;

// <DaySelectMenu day={day} dayChangeHandler={setDay} />
