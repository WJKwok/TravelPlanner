import { makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { fetchPredictions } from 'Services/googlePlaceApi';

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
}));

export const ScrapedListItem = ({ name, content, index, listItemRef }) => {
	const classes = useStyles();
	const [show, setShow] = useState(true);
	const [itemName, setItemName] = useState(name);
	const [itemContent, setItemContent] = useState(content);

	const getPredictions = async () => {
		const locationCoords = '52.5200,13.4050';
		const data = await fetchPredictions(itemName, locationCoords);
	};

	const deleteItem = () => {
		setShow(false);
		delete listItemRef.current[index];
	};

	return show ? (
		<div className={classes.root}>
			<DeleteIcon className={classes.delete} onClick={deleteItem} />
			<label>
				Place name:
				<textarea
					value={itemName}
					onChange={(e) => setItemName(e.target.value)}
				/>
			</label>
			<textarea
				value={
					itemContent ? itemContent : 'Unfortunately could not scrap content'
				}
				rows={10}
				onChange={(e) => setItemContent(e.target.value)}
			/>
		</div>
	) : null;
};
