import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react';

import { makeStyles } from '@material-ui/core/styles';
import { MapMarker } from './mapMarkerWebAndMobile';

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
	resizable,
	children,
	clickedCard,
}) {
	const mapClass = useStyles();
	let mapsRef = useRef(null);
	let mapRef = useRef(null);
	const [center, setCenter] = useState({
		lat: coordinates[0],
		lng: coordinates[1],
	});

	console.log('mapcenter mobile:', center);
	const [zoom, setZoom] = useState(11);

	const paddedBounds = (npad, spad, epad, wpad) => {
		var SW = mapRef.current.getBounds().getSouthWest();
		var NE = mapRef.current.getBounds().getNorthEast();
		var topRight = mapRef.current.getProjection().fromLatLngToPoint(NE);
		var bottomLeft = mapRef.current.getProjection().fromLatLngToPoint(SW);
		var scale = Math.pow(2, mapRef.current.getZoom());

		var SWtopoint = mapRef.current.getProjection().fromLatLngToPoint(SW);
		var SWpoint = new mapsRef.current.Point(
			(SWtopoint.x - bottomLeft.x) * scale + wpad,
			(SWtopoint.y - topRight.y) * scale - spad
		);
		var SWworld = new mapsRef.current.Point(
			SWpoint.x / scale + bottomLeft.x,
			SWpoint.y / scale + topRight.y
		);
		var pt1 = mapRef.current.getProjection().fromPointToLatLng(SWworld);

		var NEtopoint = mapRef.current.getProjection().fromLatLngToPoint(NE);
		var NEpoint = new mapsRef.current.Point(
			(NEtopoint.x - bottomLeft.x) * scale - epad,
			(NEtopoint.y - topRight.y) * scale + npad
		);
		var NEworld = new mapsRef.current.Point(
			NEpoint.x / scale + bottomLeft.x,
			NEpoint.y / scale + topRight.y
		);
		var pt2 = mapRef.current.getProjection().fromPointToLatLng(NEworld);

		return new mapsRef.current.LatLngBounds(pt1, pt2);
	};

	useEffect(() => {
		if (clickedCard) {
			let isInView = paddedBounds(50, 200, 0, 0).contains({
				lat: clickedCard.place.location[0],
				lng: clickedCard.place.location[1],
			});

			if (!isInView) {
				setCenter({
					lat: clickedCard.place.location[0],
					lng: clickedCard.place.location[1],
				});
			}

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
		if (mapsRef.current && spots.length > 0) {
			// calculating bounds is difficult for only one spot
			if (spots.length === 1) {
				setZoom(11);
				setCenter({
					lat: spots[0].place.location[0],
					lng: spots[0].place.location[1],
				});
				return;
			}

			const bounds = new mapsRef.current.LatLngBounds();
			for (let i = 0; i < spots.length; i++) {
				const marker = spots[i].place.location;
				const newPoint = new mapsRef.current.LatLng(marker[0], marker[1]);
				bounds.extend(newPoint);
			}

			mapRef.current.fitBounds(bounds, {
				top: 50,
				right: 0,
				bottom: 180,
				left: 0,
			});
		}
	}, [spots.length]);

	//https://github.com/google-map-react/google-map-react/issues/986
	const handleChange = (maps) => {
		setZoom(maps.zoom);
	};

	// to be able to use 'new mapsRef.current.LatLngBounds()'
	const apiIsLoaded = (map, maps) => {
		mapsRef.current = maps;
		mapRef.current = map;
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
