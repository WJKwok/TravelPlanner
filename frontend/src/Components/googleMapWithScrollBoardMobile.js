import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react';

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
	let mapref = useRef(null);
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
			// setZoom(15);
			// you wanna leave the zoom as it is but just center
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
				onClick={() => pinClicked(index, spot)}
				mouseOverId={mouseOverCard}
				clickedCardId={clickedCard ? clickedCard.id : null}
				category={spot.categories[0]}
				liked={spot.liked}
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

	useEffect(() => {
		if (mapref.current && spots.length > 0) {
			// calculating bounds is difficult for only one spot
			if (spots.length === 1) {
				setZoom(11);
				setCenter({
					lat: spots[0].place.location[0],
					lng: spots[0].place.location[1],
				});
				return;
			}

			const bounds = new mapref.current.LatLngBounds();
			for (let i = 0; i < spots.length; i++) {
				const marker = spots[i].place.location;
				const newPoint = new mapref.current.LatLng(marker[0], marker[1]);
				bounds.extend(newPoint);
			}

			const size = {
				width: window.innerWidth, // Map width in pixels
				height: window.innerHeight, // Map height in pixels
			};

			const newBounds = {
				ne: {
					lat: bounds.getNorthEast().lat(),
					lng: bounds.getNorthEast().lng(),
				},
				sw: {
					lat: bounds.getSouthWest().lat(),
					lng: bounds.getSouthWest().lng(),
				},
			};

			let { zoom, center } = fitBounds(newBounds, size);
			console.log({ zoom, center });

			setZoom(zoom);
			setCenter(center);
		}
	}, [spots.length]);

	//https://github.com/google-map-react/google-map-react/issues/986
	const handleChange = (maps) => {
		setZoom(maps.zoom);
	};

	// to be able to use 'new mapref.current.LatLngBounds()'
	const apiIsLoaded = (map, maps) => {
		mapref.current = maps;
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
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
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
