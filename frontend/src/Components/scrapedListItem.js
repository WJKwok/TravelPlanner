import React, { useState } from 'react';
import { fetchPredictions } from 'Services/googlePlaceApi';

export const ScrapedListItem = ({ name, content }) => {
	const [itemName, setItemName] = useState(name);

	const getPredictions = async () => {
		const locationCoords = '52.5200,13.4050';
		const data = await fetchPredictions(itemName, locationCoords);
	};

	return (
		<div>
			<button onClick={getPredictions}>Get Google Place Data</button>
			<input value={itemName} onChange={(e) => setItemName(e.target.value)} />
			<p>{content}</p>
		</div>
	);
};
