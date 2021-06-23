import React, { useEffect, useRef, useContext } from 'react';
import { SpotContext } from 'Store';

import { ListCard, CategoryChipBar } from 'Components';

import { makeStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';
import Button from '@material-ui/core/Button';

import { getSpotsFromState } from 'utils/getSpotsFromState';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'relative',
	},
	spotCards: {
		paddingTop: 50,
		height: '100vh',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	categoryBar: {
		zIndex: 10,
		position: 'fixed',
		width: '100%',
		top: 0,
	},
	mapViewButton: {
		position: 'fixed',
		left: '50%',
		transform: 'translateX(-50%)',
		bottom: '4vh',
	},
}));

export const ListPage = () => {
	const classes = useStyles();

	let myref = useRef(null);
	const { dispatch, spotState } = useContext(SpotContext);
	const spots = getSpotsFromState(spotState);

	useEffect(() => {
		console.log('ref', myref);
		myref.current.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [spotState.clickedCategories.length]);

	return (
		<div className={classes.root}>
			<div className={classes.categoryBar}>
				<CategoryChipBar />
			</div>
			<div ref={myref} className={classes.spotCards}>
				{spots.length > 0 ? (
					spots.map((spot) => <ListCard key={spot.id} spotId={spot.id} />)
				) : (
					<p>empty list!</p>
				)}
			</div>
			<div className={classes.button}>
				<Button
					className={classes.mapViewButton}
					variant="contained"
					color="secondary"
					startIcon={<MapIcon />}
					onClick={() =>
						dispatch({ type: 'SWITCH_VIEW', payload: { view: 'MAP' } })
					}
				>
					Map View
				</Button>
			</div>
		</div>
	);
};
