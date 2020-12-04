import React from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles } from '@material-ui/core/styles';
import { badgeStyles, iconDict } from './spotIcons';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles({
	gMap: {
		width: '100%',
		height: 220,
	},
});

function GoogleMap({ spots, city, pinClicked }) {
	const classes = badgeStyles();
	const mapClass = useStyles();

	const coordinates = {
		Berlin: {
			lat: 52.52,
			lng: 13.4,
		},
		Zurich: {
			lat: 47.3769,
			lng: 8.5417,
		},
		'New+York': {
			lat: 40.7128,
			lng: -74.006,
		},
	};

	let center = coordinates[city];

	const zoom = 11;

	//overriding classes use 'classes={{componenetNameToOverride: class}}'
	const MapPin = ({ text, index, icon, category }) => (
		<Badge
			badgeContent={<p>{text}</p>}
			onClick={() => pinClicked(index)}
			classes={{ badge: classes[category] }}
		>
			{icon}
		</Badge>
	);

	const markerPins = spots.map((spot, index) => {
		const place = spot.place;
		return (
			<MapPin
				key={spot.id}
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
