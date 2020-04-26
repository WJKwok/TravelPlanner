import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {TextField, MenuItem, Button} from '@material-ui/core/';
import FlightIcon from '@material-ui/icons/Flight';

import { PlaceContext } from '../Store/PlaceContext';
import { fetchCategories } from '../Services/googlePlaceApi'

const useStyles = makeStyles({
    textField: {
        marginRight: 5,
        width: '25ch',
    },
    submitButton: {
        height: 53,
    },
    root: {
        paddingTop: 20,
        paddingBottom: 40,
    }
})

function Form() {

    const { placeState, dispatch } = useContext(PlaceContext);

    const [days, setDays] = useState(placeState.days);
    const [location, setLocation] = useState(placeState.location);

    useEffect(() => {
        setDays(placeState.days);
        setLocation(placeState.location);
    }, [placeState.location])

    // console.log('form has been re-rendered: ', days, location)

    const placeTypes = ['Restaurants', "Hotels", "Tourist+attraction"];

    const fetchPlaces = async () => {
        fetchCategories(placeTypes, location, dispatch)
    }

    const submitHandler = async () => {
        dispatch({ type:"CLEAR_STATE" })
        dispatch({ type:"LOAD_EMPTY_DAYS", payload:{numberOfDays: days, city: location}})
        fetchPlaces();
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextField
            className={classes.textField}
            id="location"
            select
            label="Select City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
            >
                <MenuItem value="Berlin">Berlin</MenuItem>
                <MenuItem value="Zurich">Zurich</MenuItem>
                <MenuItem value="New+York">New York</MenuItem>
            </TextField>
            <TextField 
                className={classes.textField}
                label="Days" 
                value={days} 
                variant="outlined" 
                onChange={(e) => setDays(e.target.value)}
            />
            <Button 
                variant="outlined" 
                className={classes.submitButton}
                onClick={submitHandler}
                startIcon={<FlightIcon />}
            >
                Submit
            </Button>
        </div>
    );
}

export default Form;

