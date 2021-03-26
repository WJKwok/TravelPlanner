import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import CategoryChip from './categoryChip';

const useStyles = makeStyles((theme) => ({
	categoryChipBoard: {
		display: 'flex',
		overflowX: 'auto',
		listStyle: 'none',
		padding: theme.spacing(0.5),
		alignItems: 'flex-start',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		backgroundColor: 'rgba(255,255,255)',
	},
}));

const CategoryChipBar = ({ categoryChips, toggleChipHandler }) => {
	const classes = useStyles();

	return (
		<Paper
			component="ul"
			className={classes.categoryChipBoard}
			variant="outlined"
		>
			{categoryChips.map((data) => {
				return (
					<li key={data.key}>
						<CategoryChip data={data} toggleChipHandler={toggleChipHandler} />
					</li>
				);
			})}
		</Paper>
	);
};

export default CategoryChipBar;
