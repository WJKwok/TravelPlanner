import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	cardsScroll: {
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		padding: 10,
	},
}));

const CardsHorizontalScrollWindow = ({
	cardsDivRef,
	clickedCard,
	setMouseOverCard,
	handleCardClicked,
}) => {
	const classes = useStyles();

	return (
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
							onCardClicked={handleCardClicked}
						/>
				  ))
				: placeHolderText}
			<div style={{ height: '5px', minWidth: '10px', clear: 'both' }}></div>
		</div>
	);
};
