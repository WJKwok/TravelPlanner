import React from 'react';
import GoogleMapReact from 'google-map-react';

function GoogleMap({places}) {

    const center = {
        lat: 52.52,
        lng: 13.40,
    }

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
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {markerPins}
            </GoogleMapReact>
        </div>
    )
}

export default GoogleMap;