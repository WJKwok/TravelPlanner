import React, { useState } from 'react';
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
	const [email, setEmail] = useState('');
	const [emails, setEmails] = useState(trip.sharedWith);

	const handleClose = () => {
		shareTrip({
			variables: {
				tripId: trip.id,
				emails,
			},
		});
		setEmail('');
		setOpen(false);
	};

	const handleEnter = () => {
		const emailsCopy = emails;
		const newEmails = [...emailsCopy, email];
		setEmails(newEmails);
		setEmail('');
	};

	const deleteOneEmail = (email) => {
		const filteredEmail = emails.filter((e) => e !== email);
		setEmails(filteredEmail);
	};

	const [shareTrip] = useMutation(SHARE_TRIP, {
		onCompleted({ shareTrip }) {
			console.log('Trip shared', shareTrip);
		},
		onError(err) {
			console.log(err);
		},
	});

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To subscribe to this website, please enter your email address here.
						We will send updates occasionally.
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
						<Chip onDelete={() => deleteOneEmail(email)} label={email} />
					))}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Share
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const SHARE_TRIP = gql`
	mutation shareTrip($tripId: ID!, $emails: [String]!) {
		shareTrip(tripId: $tripId, emails: $emails) {
			id
		}
	}
`;
