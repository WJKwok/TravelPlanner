import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	iframe: {
		borderStyle: 'solid',
		borderWidth: '1px',
		margin: '5px',
	},
}));

const ListScraper = () => {
	const classes = useStyles();

	return (
		<div className={classes.iframe}>
			<iframe width="100%" height="100%" srcDoc={'<h2>Hi</h2>'} />
		</div>
	);
};

export default ListScraper;
