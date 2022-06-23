import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from 'react';
import { fetchOnePlaceId, fetchPredictions } from 'Services/googlePlaceApi';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: '5px',
		minWidth: '200px',
		maxWidth: '200px',
		height: '400px',
		overflowY: 'auto',
	},
	delete: {
		float: 'right',
		'&:hover': {
			color: 'red',
			cursor: 'pointer',
		},
	},
	suggestion: {
		'&:hover': {
			backgroundColor: 'antiqueWhite',
			cursor: 'pointer',
		},
	},
	googlePlaceSummary: {
		whiteSpace: 'pre-wrap',
	},
}));

export const ScrapedListItem = ({ name, content, index, listItemRef }) => {
	const classes = useStyles();
	const [show, setShow] = useState(true);
	const [itemName, setItemName] = useState(name);
	const [itemContent, setItemContent] = useState(content);
	const [suggestions, setSuggestion] = useState([]);
	const [googlePlace, setGooglePlace] = useState();

	const locationCoords = '52.5200,13.4050';

	const setGooglePlaceSummary = (placeObject) => {
		const { name, rating, userRatingsTotal, businessStatus, address } =
			placeObject;

		const summary = `${name}\n${rating}⭐️(${userRatingsTotal})\nBusiness Status:${businessStatus}\n${address}`;
		setGooglePlace(summary);
	};

	useEffect(() => {
		const getPredictions = async () => {
			const { predictions } = await fetchPredictions(name, locationCoords);
			if (predictions.length === 1) {
				const placeObject = await fetchOnePlaceId(predictions[0].place_id);
				editListItemRef('googlePlaceData', placeObject);
				setGooglePlaceSummary(placeObject);
			} else {
				setSuggestion(predictions);
			}
		};
		getPredictions();
	}, []);

	const editListItemRef = (field, value) => {
		listItemRef.current = {
			...listItemRef.current,
			[index]: {
				...listItemRef.current[index],
				[field]: value,
			},
		};
	};

	const editName = async (value) => {
		setItemName(value);
		editListItemRef('name', value);
		const { predictions } = await fetchPredictions(value, locationCoords);
		setSuggestion(predictions);
	};

	const editContent = (value) => {
		setItemContent(value);
		editListItemRef('content', value);
	};

	const deleteItem = () => {
		setShow(false);
		delete listItemRef.current[index];
	};

	const onSuggestionClick = async (placeId) => {
		const placeObject = await fetchOnePlaceId(placeId);
		editListItemRef('googlePlaceData', placeObject);
		setGooglePlaceSummary(placeObject);
		setSuggestion([]);
	};

	return show ? (
		<div className={classes.root}>
			<DeleteIcon className={classes.delete} onClick={deleteItem} />
			<label>
				Place name:
				<textarea value={itemName} onChange={(e) => editName(e.target.value)} />
			</label>
			{googlePlace && (
				<p className={classes.googlePlaceSummary}>{googlePlace}</p>
			)}
			{suggestions && (
				<List>
					{suggestions.map((suggestion) => {
						return (
							<ListItem
								className={classes.suggestion}
								key={suggestion.place_id}
								onClick={() => onSuggestionClick(suggestion.place_id)}
							>
								<ListItemText primary={suggestion.description} />
							</ListItem>
						);
					})}
				</List>
			)}
			<textarea
				value={
					itemContent ? itemContent : 'Unfortunately could not scrap content'
				}
				rows={10}
				onChange={(e) => editContent(e.target.value)}
			/>
		</div>
	) : null;
};
