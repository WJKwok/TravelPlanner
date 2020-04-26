import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, TextField }  from '@material-ui/core/';

import { PlaceContext } from '../Store/PlaceContext'

import SearchBoard from './searchBoard';

const useStyles = makeStyles({
    root: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#f8f8f8',
        '&:hover': {
            backgroundColor: '#e3e3e3'
        }
    },
    textField: {
        width: 400,
    },
})


function PlaceAutoComplete() {

    const { placeState, dispatch } = useContext(PlaceContext)
    const [searchState, setSearchState] = useState("");
    const [sugestionsState, setSuggestionState] = useState([]);

    const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

    const coordinates = {
        "Berlin": {
            lat: 52.52,
            lng: 13.40,
        },
        "Zurich": {
            lat: 47.37,
            lng: 8.54,
        },
        "New+York": {
            lat: 40.7128,
            lng: -74.0060
        },
    }

    console.log("Hi from placeAutoComplete: ", placeState.location);

    const searchHandler = async (e) => {
        setSearchState(e.target.value)
        const locationCoords = `${coordinates[placeState.location].lat},${coordinates[placeState.location].lng}`;
        console.log("Hi from placeAutoComplete: ", locationCoords);
        const response = await fetch(`/place/autocomplete/json?input=${e.target.value}&types=establishment&location=${locationCoords}&radius=500&key=${googlePlacesApi}`)
        const data = await response.json();
        setSuggestionState(data.predictions);
        console.log(data);
    }

    const addCard = async (placeId) => {

        const response = await fetch(`/place/details/json?placeid=${placeId}&key=${googlePlacesApi}`)
        const placeData = await response.json();

        let placeObject = {};
        placeObject['id'] = placeId
        placeObject['content'] = placeData.result.name;
        placeObject['rating'] = placeData.result.rating;
        placeObject['photoRef'] = placeData.result.photos ? placeData.result.photos[0].photo_reference : "0";
        placeObject['location'] = placeData.result.geometry.location;
        
        console.log(placeObject);
        dispatch({type:'ADD_SEARCH_ITEM', payload:{placeObject}})
        setSearchState("");
        setSuggestionState([]);
    }

    const searchBoard = () => {
        const column = placeState.columns['searched-items'];
        const places = column.placeIds.map(placeId => 
            placeState.places[placeId]
        );

        return <SearchBoard key={column.id} column={column} places={places}/>
        
    }

    const classes = useStyles();

    return(
        <div>
            <TextField 
                className={classes.textField}
                label="Place Search" 
                value={searchState} 
                variant="outlined" 
                onChange={searchHandler}
            />
            <List>
                {sugestionsState.map((suggestion) => {
                    return <ListItem
                            className={classes.root}
                            key={suggestion.place_id} 
                            onClick={() => addCard(suggestion.place_id)}
                            >
                                <ListItemText primary={suggestion.description}/>
                            </ListItem>
                })}
            </List>
            {searchBoard()}
        </div>
        
    );
}

export default PlaceAutoComplete;