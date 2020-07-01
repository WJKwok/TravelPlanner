import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, TextField }  from '@material-ui/core/';


import {fetchOnePlaceId, fetchPredictions} from '../Services/googlePlaceApi';

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


function PlaceAutoComplete({clickFunction, city}) {

    const [searchState, setSearchState] = useState("");
    const [sugestionsState, setSuggestionState] = useState([]);

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

    console.log("Hi from placeAutoComplete: ", city);

    const searchHandler = async (e) => {
        setSearchState(e.target.value)
        const locationCoords = `${coordinates[city].lat},${coordinates[city].lng}`;
        const data = await fetchPredictions(e.target.value, locationCoords)
        setSuggestionState(data.predictions);
        console.log(data);
    }

    useEffect(() => {
        setSearchState("");
        setSuggestionState([]);
    }, [city])

    const addCard = async (placeId) => {

        const placeObject = await fetchOnePlaceId(placeId)
        clickFunction(placeObject)
        setSearchState("");
        setSuggestionState([]);
    }

    const classes = useStyles();

    return(
        <div>
            <TextField 
                className={classes.textField}
                label={`Searching in ${city} ...`}
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
        </div>
        
    );
}

export default PlaceAutoComplete;