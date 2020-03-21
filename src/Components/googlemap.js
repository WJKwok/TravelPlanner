import React, { useContext } from 'react';
import GoogleMapReact from 'google-map-react';

import { PlaceContext } from '../Store/PlaceContext';

function GoogleMap({places}) {

    const {contextState} = useContext(PlaceContext);
    console.log(contextState.location);

    const coordinates = {
        "Berlin": {
            lat: 52.52,
            lng: 13.40,
        },
        "Zurich": {
            lat: 47.3769,
            lng: 8.5417,
        },
        "New+York": {
            lat: 40.7128,
            lng: -74.0060
        },
    }

    let center = coordinates[contextState.location];

    const zoom = 11

    const MapPin = ({text}) => (
        <div className='pin'>
            {text}
        </div>
        );

    const markerPins = places.map((place, index) => {
        return <MapPin 
        key={place.id}
        lat={place.location.lat}
        lng={place.location.lng}
        text={`${index + 1}`}
        />
    })
    
    return (
        <div className="map">
            <GoogleMapReact
                bootstrapURLKeys={{ 
                    key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY, 
                    language: 'en'
                }}
                center={center}
                defaultZoom={zoom}
            >
                {markerPins}
            </GoogleMapReact>
        </div>
    )
}

export default GoogleMap;