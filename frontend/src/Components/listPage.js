import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { ListCard } from './listCard';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'relative',
		paddingTop: 50,
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
		bottom: 5,
	},
}));

export const ListPage = ({ spots, catBar, setIsListView }) => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={classes.categoryBar}>{catBar}</div>
			{spots.length > 0 ? (
				spots.map((spot) => <ListCard key={spot.id} spotId={spot.id} />)
			) : (
				<p>empty list!</p>
			)}
			<div
				className={classes.mapViewButton}
				onClick={() => setIsListView(false)}
			>
				Map View
			</div>
		</div>
	);
};
