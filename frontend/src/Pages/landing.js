import React, { Suspense, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CardMedia from '@material-ui/core/CardMedia';
import AppBar from '../Components/appBar';

const useStyles = makeStyles({
	cardMedia: {
		position: 'relative',
		width: '100%',
		height: '50vh',
		borderRadius: 10,
	},
	autocomplete: {
		position: 'absolute',
		bottom: -30,
		left: '50%',
		transform: 'translateX(-50%)',
		width: '100%',
		maxWidth: 300,
		backgroundColor: 'white',
		padding: '10px 10px 0px 10px',
		borderRadius: 5,
	},
});

function Landing() {
	const classes = useStyles();
	const history = useHistory();
	const [guides, setGuides] = useState([]);

	useQuery(GET_GUIDES, {
		onCompleted({ getGuides }) {
			console.log('guides: ', getGuides);
			setGuides(getGuides);
		},
	});

	return (
		<>
			<AppBar />
			<CardMedia
				className={classes.cardMedia}
				image="https://i.imgur.com/rpw1Dol.jpg"
			>
				<Autocomplete
					className={classes.autocomplete}
					options={guides}
					getOptionLabel={(option) => option.city}
					onChange={(_, newValue) => {
						if (newValue) {
							const pushLink = process.env.REACT_APP_NEW_UI
								? `web/planner/${newValue.id}`
								: `/planner/${newValue.id}`;
							history.push(pushLink);
						}
					}}
					renderInput={(params) => (
						<TextField {...params} label="Select a City" variant="outlined" />
					)}
				/>
			</CardMedia>
		</>
	);
}

const GET_GUIDES = gql`
	query getGuides {
		getGuides {
			city
			id
		}
	}
`;

export default Landing;
