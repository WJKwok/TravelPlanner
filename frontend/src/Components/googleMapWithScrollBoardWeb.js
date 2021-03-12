import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles } from '@material-ui/core/styles';
import { MapMarker } from './mapMarkerWeb';

const useStyles = makeStyles((theme) => ({
	gMap: {
		width: '100%',
		height: '100vh',
	},
	resizable: {
		resize: 'vertical',
		overflow: 'auto',
		position: 'relative',
		zIndex: 3,
	},
}));

function GoogleMapWithScrollBoard({
	spots,
	coordinates,
	pinClicked,
	mouseOverCard,
	resizable,
	children,
	clickedCard,
}) {
	const mapClass = useStyles();

	const [center, setCenter] = useState({
		lat: coordinates[0],
		lng: coordinates[1],
	});
	const [zoom, setZoom] = useState(11);

	useEffect(() => {
		if (clickedCard) {
			setCenter({
				lat: clickedCard.place.location[0],
				lng: clickedCard.place.location[1],
			});
			setZoom(15);
		}
	}, [clickedCard]);

	const markerPins = spots.map((spot, index) => {
		const place = spot.place;
		return (
			<MapMarker
				key={spot.id}
				id={spot.id}
				lat={place.location[0]}
				lng={place.location[1]}
				text={`${index + 1}`}
				onClick={() => pinClicked(index, spot.id)}
				mouseOverId={mouseOverCard}
				clickedCardId={clickedCard ? clickedCard.id : null}
				category={spot.categories[0]}
			/>
		);
	});

	const createMapOptions = (maps) => {
		return {
			zoomControl: false,
			fullscreenControl: false,
			clickableIcons: false,
		};
	};

	//https://github.com/google-map-react/google-map-react/issues/986
	const handleChange = (e) => {
		setZoom(e.zoom);
	};

	return (
		<div
			className={`${mapClass.gMap} ${resizable ? mapClass.resizable : null}`}
		>
			<GoogleMapReact
				bootstrapURLKeys={{
					key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
					language: 'en',
				}}
				options={createMapOptions}
				center={center}
				onChange={(e) => handleChange(e)}
				zoom={zoom}
			>
				{markerPins}
			</GoogleMapReact>
			{children}
		</div>
	);
}

export default GoogleMapWithScrollBoard;

/* using animation
marker: {
    animation: `$bounce-6 1000ms ${theme.transitions.easing.easeInOut}`,
},
'@keyframes bounce-6': {
    '0%': { transform: 'scale(1,1)      translateY(0)' },
    '10%': { transform: 'scale(2.1,.9)   translateY(0)' },
    '30%': { transform: 'scale(.9,1.1)   translateY(-20px)' },
    '57%': { transform: 'scale(1,1)      translateY(-7px)' },
    '64%': { transform: 'scale(1,1)      translateY(0)' },
    '100%': { transform: 'scale(1,1)      translateY(0)' },
},
*/
