import React from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import SearchIcon from '@material-ui/icons/Search';
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import { deepPurple, indigo, blue} from '@material-ui/core/colors/';

const useStyles = makeStyles({
    Retail: {
        backgroundColor: deepPurple[500],
        color: "white"
    },
    Restaurant: {
        backgroundColor: indigo[500],
        color: "white"
    },
    Museum: {
        backgroundColor: blue[500],
        color: "white"
    },
    Searched: {
        backgroundColor: blue[900],
        color: "white"
    }
});

function GoogleMap({spots, city, pinClicked}) {

    const classes = useStyles();

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

    const iconDict = {
        Retail: <LocalMallIcon style={{ color: deepPurple[500] }}/>,
        Restaurant: <RestaurantIcon style={{ color: indigo[500] }}/>,
        Museum: <AccountBalanceIcon style={{ color: blue[500] }}/>,
        Searched: <SearchIcon style={{ color: blue[900] }}/>
    }

    let center = coordinates[city];

    const zoom = 11

    //overriding classes use 'classes={{componenetNameToOverride: class}}'
    const MapPin = ({text, index, icon, category}) => (
        <Badge 
            badgeContent={<p>{text}</p>} 
            onClick={() => pinClicked(index)} 
            classes={{badge: classes[category]}}> 
            {icon}
        </Badge>
    );

    const markerPins = spots.map((spot, index) => {
        const place = spot.place
        return <MapPin 
        key={spot.id}
        lat={place.location[0]}
        lng={place.location[1]}
        index={index}
        text={`${index + 1}`}
        icon={iconDict[spot.category]}
        category={spot.category}
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