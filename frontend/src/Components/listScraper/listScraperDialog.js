import React from 'react';

import { Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ListScraper } from './listScraper';

const useStyles = makeStyles((theme) => ({
	searchDialogSize: {
		minHeight: 300,
		padding: '13px',
	},
}));

export const ListScraperDialog = ({ listScraperOpen, setListScraperOpen }) => {
	const classes = useStyles();

	return (
		<Dialog
			open={listScraperOpen}
			onClose={() => setListScraperOpen(false)}
			fullWidth={true}
		>
			<div className={classes.searchDialogSize}>
				<ListScraper />
			</div>
		</Dialog>
	);
};
