import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import Box from '@material-ui/core/Box';

import AuthModal from './AuthModal';
import SnackBar from './snackBar';
import { Button, Snackbar } from '@material-ui/core';

import { Image } from 'cloudinary-react';
import { AuthContext } from 'Store';

const useStyles = makeStyles((theme) => ({
	AppBar: (props) => ({
		backgroundColor: props.transparent ? 'transparent' : 'white',
	}),
	toolbar: {
		width: '100%',
		maxWidth: 1280,
		margin: 'auto',
		padding: '0px 16px',
	},
	logo: {
		color: '#000',
		'&:hover': {
			color: '#000',
			textDecoration: 'none',
		},
	},
	partnerEmoji: {
		padding: '0px 5px',
	},
	partnerLogo: {
		height: 50,
		width: 100,
		objectFit: 'cover',
	},
	iconButton: {
		cursor: 'pointer',
		color: '#000',
	},
	sizedBox: {
		flexGrow: 1,
	},
}));

const MenuAppBar = ({ offset, transparent, partnerLogo }) => {
	const styleProps = { transparent };
	const classes = useStyles(styleProps);

	const {
		authState: { user },
	} = useContext(AuthContext);
	const history = useHistory();

	const [modalOpen, setModalOpen] = useState(false);

	const iconClickHandler = () => {
		ReactGA.event({
			category: 'Button',
			action: 'AppBar Profile clicked',
		});

		if (user) {
			history.push('/trips');
		} else {
			setModalOpen(true);
		}
	};

	return (
		<>
			<AppBar position="fixed" className={classes.AppBar} elevation={0}>
				<Toolbar disableGutters={true} className={classes.toolbar}>
					<Typography
						component={Link}
						to="/"
						className={classes.logo}
						variant="h4"
						data-testid={`nav-planner${user ? '-user' : ''}`}
					>
						Planners
					</Typography>
					{partnerLogo && (
						<>
							{/* <Typography className={classes.partnerEmoji} variant="h4">
								🤝
							</Typography> */}
							<Image
								cloudName={process.env.REACT_APP_CLOUD_NAME}
								publicId={partnerLogo}
								className={classes.partnerLogo}
							/>
						</>
					)}
					<Box className={classes.sizedBox} />
					<FaceIcon
						className={classes.iconButton}
						data-testid={`nav-trips${user ? '-user' : ''}`}
						onClick={iconClickHandler}
					/>
				</Toolbar>
				<SnackBar />
			</AppBar>
			{offset ? <Toolbar /> : null}
			<AuthModal
				registerOpen={modalOpen}
				setRegisterOpen={setModalOpen}
				navgiateTo={() => history.push('/trips')}
			/>
		</>
	);
};

export default MenuAppBar;
