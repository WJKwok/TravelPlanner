import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { blue, red, green } from '@material-ui/core/colors/';
import Zoom from '@material-ui/core/Zoom';

import { SnackBarContext } from '../Store/SnackBarContext';

const useStyles = makeStyles({
	snackBar: (props) => ({
		width: '100%',
		maxWidth: 1280,
		textAlign: 'center',
		color: 'white',
		backgroundColor: props.backgroundColor,
		position: 'absolute',
		top: 0,
	}),
});

const snackBarColorCode = {
	Error: red[500],
	Confirm: green[500],
	Info: blue[500],
};

const SnackBar = () => {
	const { snackMessage } = useContext(SnackBarContext);
	const props = { backgroundColor: snackBarColorCode[snackMessage.code] };
	const classes = useStyles(props);

	return (
		<Zoom in={!!snackMessage.text} data-testid="snackBar">
			<p className={classes.snackBar}>{snackMessage.text}</p>
		</Zoom>
	);
};

export default SnackBar;
