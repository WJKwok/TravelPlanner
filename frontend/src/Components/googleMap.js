import React from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles } from '@material-ui/core/styles';
import { badgeStyles, iconDict } from './spotIcons';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
	gMap: {
		width: '100%',
		height: 220,
	},
	marker: {
		width: 20,
		height: 20,
		borderRadius: 3,
		color: 'white',
		zIndex: 999,
		transform: 'scale(1.3)',
		// animation: `$bounce-6 1000ms ${theme.transitions.easing.easeInOut}`,
	},
	'@keyframes bounce-6': {
		'0%': { transform: 'scale(1,1)      translateY(0)' },
		'10%': { transform: 'scale(2.1,.9)   translateY(0)' },
		'30%': { transform: 'scale(.9,1.1)   translateY(-20px)' },
		'57%': { transform: 'scale(1,1)      translateY(-7px)' },
		'64%': { transform: 'scale(1,1)      translateY(0)' },
		'100%': { transform: 'scale(1,1)      translateY(0)' },
	},
}));

function GoogleMap({ spots, coordinates, pinClicked, mouseOverCard }) {
	const classes = badgeStyles();
	const mapClass = useStyles();

	// const coordinates = {
	// 	Berlin: {
	// 		lat: 52.52,
	// 		lng: 13.4,
	// 	},
	// 	Zurich: {
	// 		lat: 47.3769,
	// 		lng: 8.5417,
	// 	},
	// 	'New+York': {
	// 		lat: 40.7128,
	// 		lng: -74.006,
	// 	},
	// };

	let center = { lat: coordinates[0], lng: coordinates[1] };

	const zoom = 11;

	//overriding classes use 'classes={{componenetNameToOverride: class}}'
	const MapPin = ({ text, index, id, icon, category }) => (
		<Badge
			badgeContent={<p>{text}</p>}
			onClick={() => pinClicked(index, id)}
			classes={{ badge: classes[category] }}
			className={mouseOverCard === id ? mapClass.marker : null}
		>
			{icon}
		</Badge>
	);

	const markerPins = spots.map((spot, index) => {
		const place = spot.place;
		return (
			<MapPin
				key={spot.id}
				id={spot.id}
				lat={place.location[0]}
				lng={place.location[1]}
				index={index}
				text={`${index + 1}`}
				icon={iconDict[spot.category]}
				category={spot.category}
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

	return (
		<div className={mapClass.gMap}>
			<GoogleMapReact
				bootstrapURLKeys={{
					key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
					language: 'en',
				}}
				options={createMapOptions}
				center={center}
				defaultZoom={zoom}
			>
				{markerPins}
			</GoogleMapReact>
		</div>
	);
}

export default GoogleMap;
