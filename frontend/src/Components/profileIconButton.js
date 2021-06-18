import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import FaceIcon from '@material-ui/icons/Face';

import { AuthContext } from 'Store';
import AuthModal from './AuthModal';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { colors } from '@material-ui/core';

const useStyles = makeStyles({
	iconButton: {
		backgroundColor: 'white',
		color: 'black',
		'&:focus': {
			outline: 'none',
		},
		'&:hover': {
			backgroundColor: 'black',
			color: 'white',
		},
	},
});

const ProfileIconButton = () => {
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
		<>
			<ButtonGroup
				variant="contained"
				color="primary"
				aria-label="contained primary button group"
			>
				<Button onClick={iconClickHandler} className={classes.iconButton}>
					<FaceIcon />
				</Button>
			</ButtonGroup>
			<AuthModal
				registerOpen={modalOpen}
				setRegisterOpen={setModalOpen}
				navgiateTo={() => history.push('/trips')}
			/>
		</>
	);
};

export default ProfileIconButton;
