import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import Box from '@material-ui/core/Box';

import { AuthContext } from '../Store/AuthContext';
import AuthModal from './AuthModal';
import SnackBar from './snackBar';
import { Button, Snackbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	toolbar: {
		width: '100%',
		maxWidth: 1280,
		margin: 'auto',
	},
	logo: {
		color: '#000',
		'&:hover': {
			color: '#000',
			textDecoration: 'none',
		},
	},
	iconButton: {
		cursor: 'pointer',
	},
	sizedBox: {
		flexGrow: 1,
	},
}));

const MenuAppBar = () => {
	const classes = useStyles();

	const {
		authState: { user },
	} = useContext(AuthContext);
	const history = useHistory();

	const [modalOpen, setModalOpen] = useState(false);

	const iconClickHandler = () => {
		if (user) {
			history.push('/trips');
		} else {
			setModalOpen(true);
		}
	};

	return (
		<div>
			<AppBar position="fixed" color="white" elevation={1}>
				<Toolbar className={classes.toolbar}>
					<Typography
						component={Link}
						to="/"
						className={classes.logo}
						variant="h4"
						data-testid={`nav-planner${user ? '-user' : ''}`}
					>
						Planners
					</Typography>
					<Box className={classes.sizedBox} />
					<FaceIcon
						className={classes.iconButton}
						data-testid={`nav-trips${user ? '-user' : ''}`}
						onClick={iconClickHandler}
					/>
				</Toolbar>
				<SnackBar />
			</AppBar>
			<AuthModal
				registerOpen={modalOpen}
				setRegisterOpen={setModalOpen}
				navgiateTo={() => history.push('/trips')}
			/>
		</div>
	);
};

export default MenuAppBar;
