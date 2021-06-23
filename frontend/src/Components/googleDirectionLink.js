import React from 'react';

export const GoogleDirectionLink = ({ place, children }) => {
	// const mapUrlLauncher = `https://www.google.com/maps/dir/?api=1&destination=${encodeURI(
	// 	place.name
	// )}&destination_place_id=${place.id}&travelmode=transit`;

	const mapUrlLauncher = `https://www.google.com/maps/search/?api=1&query=${encodeURI(
		place.name
	)}&query_place_id=${place.id}&travelmode=transit`;

	// const openLinkInNewTab = () => {
	// 	window.open(mapUrlLauncher);
	// };

	return (
		<a target="_blank" href={mapUrlLauncher}>
			{children}
		</a>
	);
};
