import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, TextField } from '@material-ui/core/';
import Paper from '@material-ui/core/Paper';

import { fetchOnePlaceId, fetchPredictions } from '../Services/googlePlaceApi';

const useStyles = makeStyles({
	root: {
		width: '100%',
		backgroundColor: '#f8f8f8',
		'&:hover': {
			backgroundColor: '#e3e3e3',
		},
	},
	blankPadding: {
		paddingBottom: '15px',
		backgroundColor: 'transparent',
	},
	textField: {
		width: '100%',
	},
});

function PlaceAutoComplete({
	clickFunction,
	city,
	coordinates,
	placeHolderText,
}) {
	const [searchState, setSearchState] = useState('');
	const [sugestionsState, setSuggestionState] = useState([]);

	// const coordinates = {
	// 	Berlin: {
	// 		lat: 52.52,
	// 		lng: 13.4,
	// 	},
	// 	Zurich: {
	// 		lat: 47.37,
	// 		lng: 8.54,
	// 	},
	// 	'New+York': {
	// 		lat: 40.7128,
	// 		lng: -74.006,
	// 	},
	// };

	console.log('Hi from placeAutoComplete: ', city);

	const searchHandler = async (e) => {
		setSearchState(e.target.value);
		const locationCoords = `${coordinates[0]},${coordinates[1]}`;
		const data = await fetchPredictions(e.target.value, locationCoords);
		setSuggestionState(data.predictions);
		console.log(data);
	};

	useEffect(() => {
		setSearchState('');
		setSuggestionState([]);
	}, [city]);

	const addCard = async (placeId) => {
		const placeObject = await fetchOnePlaceId(placeId);
		clickFunction(placeObject);
		setSearchState('');
		setSuggestionState([]);
	};

	const classes = useStyles();

	const textLabel = placeHolderText
		? placeHolderText
		: `Searching in ${city} ...`;

	return (
		<>
			<TextField
				id="google-search"
				className={classes.textField}
				label={textLabel}
				value={searchState}
				variant="outlined"
				onChange={searchHandler}
				autoFocus={true}
				autoComplete="off"
			/>
			{sugestionsState.length !== 0 ? (
				<List>
					{sugestionsState.map((suggestion) => {
						return (
							<ListItem
								data-testid="google-search-suggestion"
								className={classes.root}
								key={suggestion.place_id}
								onClick={() => addCard(suggestion.place_id)}
							>
								<ListItemText primary={suggestion.description} />
							</ListItem>
						);
					})}
				</List>
			) : (
				<Paper className={classes.blankPadding} elevation={0} />
			)}
		</>
	);
}

export default PlaceAutoComplete;
