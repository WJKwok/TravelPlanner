import React, { useState, useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const ConfirmNavPrompt = ({ when, navigate }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [lastLocation, setLastLocation] = useState(null);
	const [confirmedNavigation, setConfirmedNavigation] = useState(false);

	console.log({ modalVisible, lastLocation, confirmedNavigation, when });
	const closeModal = () => {
		setModalVisible(false);
	};

	const handleBlockedNavigation = (nextLocation) => {
		console.log('before if prompt');
		if (!confirmedNavigation) {
			console.log('after if prompt');
			setModalVisible(true);
			setLastLocation(nextLocation);
			return false;
		}
		return true;
	};

	const handleConfirmNavigationClick = () => {
		setModalVisible(false);
		setConfirmedNavigation(true);
	};

	useEffect(() => {
		if (confirmedNavigation && lastLocation) {
			navigate(lastLocation.pathname);
		}
	}, [confirmedNavigation, lastLocation]);

	return (
		<>
			<Prompt when={when} message={handleBlockedNavigation}></Prompt>
			<Dialog
				open={modalVisible}
				onClose={closeModal}
				data-testid="nav-prompt"
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Unsaved Changes'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You have unsaved changes. Would you like to stay?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						id="leave"
						onClick={handleConfirmNavigationClick}
						color="primary"
					>
						Discard Changes
					</Button>
					<Button id="stay" onClick={closeModal} color="primary" autoFocus>
						Stay
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ConfirmNavPrompt;
