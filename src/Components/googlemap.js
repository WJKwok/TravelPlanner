import React from 'react';
import GoogleMapReact from 'google-map-react';

function GoogleMap({places}) {

    const center = {
        lat: 52.52,
        lng: 13.40,
    }

    const zoom = 11

    const MapPin = () => (
        <div className="pin">
        </div>
        );

    const markerPins = places.map(place => {
        return <MapPin 
        key={place.id}
        lat={place.location.lat}
        lng={place.location.lng}
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