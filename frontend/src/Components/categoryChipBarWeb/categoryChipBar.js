import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Snackbar } from '@material-ui/core';
import CategoryChip from './categoryChip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import SnackBar from '../snackBar';
const useStyles = makeStyles((theme) => ({
	chipAndSnack: {
		zIndex: 10,
		position: 'absolute',
		width: '100%',
		top: 0,
		left: 0,
	},
	chipRow: {
		display: 'flex',
		overflowX: 'auto',
		listStyle: 'none',
		paddingLeft: 3,
		alignItems: 'flex-start',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	categoryChipBoard: {
		display: 'flex',
		alignItems: 'center',
		padding: '3px 0px 3px 0px',
		// zIndex: 10,
		// position: 'absolute',
		// width: '100%',
		// top: 0,
		// left: 0,
		marginBottom: 0,
	},
	heartButton: {
		borderRight: '1px solid darkgrey',
		padding: 5,
		cursor: 'pointer',
	},
}));

const CategoryChipBar = ({
	categoryChips,
	toggleChipHandler,
	showOnlyLiked,
}) => {
	const classes = useStyles();

	return (
		<div className={classes.chipAndSnack}>
			<Paper
				component="ul"
				className={classes.categoryChipBoard}
				square
				elevation={0}
			>
				<Tooltip title="Show only liked spots" arrow>
					<div className={classes.heartButton} onClick={showOnlyLiked}>
						<FavoriteIcon color="error" />
					</div>
				</Tooltip>
				<div className={classes.chipRow}>
					{categoryChips.map((data) => {
						return (
							<li key={data.key}>
								<CategoryChip
									data={data}
									toggleChipHandler={toggleChipHandler}
								/>
							</li>
						);
					})}
				</div>
			</Paper>
			<SnackBar />
		</div>
	);
};

export default CategoryChipBar;
