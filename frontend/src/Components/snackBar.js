import React, { useContext } from 'react';

import { SnackBarContext } from 'Store';

import { makeStyles } from '@material-ui/core/styles';
import { blue, red, green } from '@material-ui/core/colors/';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles({
	snackBar: (props) => ({
		width: '100%',
		textAlign: 'center',
		color: 'white',
		backgroundColor: props.backgroundColor,
	}),
});

const snackBarColorCode = {
	Error: red[500],
	Confirm: green[500],
	Info: blue[500],
};

export const SnackBar = () => {
	const { snackMessage } = useContext(SnackBarContext);
	const props = { backgroundColor: snackBarColorCode[snackMessage.code] };
	const classes = useStyles(props);

	return (
		<Zoom in={!!snackMessage.text} data-testid="snackBar">
			<p className={classes.snackBar}>{snackMessage.text}</p>
		</Zoom>
	);
};
