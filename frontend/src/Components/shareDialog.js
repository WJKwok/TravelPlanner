import React, { useState, useContext } from 'react';
import { SnackBarContext } from '../Store/SnackBarContext';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';

import { useMutation, gql } from '@apollo/client';

export default function FormDialog({ trip, open, setOpen }) {
	const { setSnackMessage } = useContext(SnackBarContext);

	const [email, setEmail] = useState('');
	const [emailToDelete, setEmailToDelete] = useState('');
	const [emails, setEmails] = useState(trip.sharedWith);

	const handleClose = () => {
		setEmail('');
		setOpen(false);
	};

	const handleEnter = () => {
		shareTripAddUser({
			variables: {
				tripId: trip.id,
				email,
			},
		});
	};

	const deleteOneEmail = (email) => {
		setEmailToDelete(email);
		shareTripRemoveUser({
			variables: {
				tripId: trip.id,
				email,
			},
		});
	};

	const [shareTripRemoveUser] = useMutation(SHARE_TRIP_REMOVE_USER, {
		onCompleted({ shareTripRemoveUser }) {
			console.log('Trip removed user', shareTripRemoveUser);
			const filteredEmail = emails.filter((e) => e !== emailToDelete);
			setEmails(filteredEmail);
			setSnackMessage({ text: `Removed ${emailToDelete}`, code: 'Confirm' });
		},
		onError({ graphQLErrors, networkError }) {
			if (graphQLErrors) {
				setSnackMessage({
					text: `Weird, could not delete ${emailToDelete}`,
					code: 'Error',
				});
			}
		},
	});

	const [shareTripAddUser] = useMutation(SHARE_TRIP_ADD_USER, {
		onCompleted({ shareTripAddUser }) {
			console.log('Trip added user', shareTripAddUser);
			const emailsCopy = emails;
			const newEmails = [...emailsCopy, email];
			setEmails(newEmails);
			setEmail('');
			setSnackMessage({ text: `Added ${email}`, code: 'Confirm' });
		},
		onError({ graphQLErrors, networkError }) {
			if (graphQLErrors) {
				setSnackMessage({ text: `${graphQLErrors[0].message}`, code: 'Error' });
			}
		},
	});

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Share</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Edit your trip in real-time with your friend 🥰 simply add them by
					their email addresses.
				</DialogContentText>
				<TextField
					autoFocus
					autoComplete="off"
					margin="dense"
					id="name"
					label="Email Address"
					type="email"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							handleEnter();
						}
					}}
				/>
				{emails.map((email) => (
					<Chip
						key={email}
						onDelete={() => deleteOneEmail(email)}
						label={email}
					/>
				))}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const SHARE_TRIP_REMOVE_USER = gql`
	mutation shareTripRemoveUser($tripId: ID!, $email: String!) {
		shareTripRemoveUser(tripId: $tripId, email: $email) {
			id
			sharedWith
		}
	}
`;

const SHARE_TRIP_ADD_USER = gql`
	mutation shareTripAddUser($tripId: ID!, $email: String!) {
		shareTripAddUser(tripId: $tripId, email: $email) {
			id
			sharedWith
		}
	}
`;
