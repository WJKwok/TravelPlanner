import React, { useState, useContext } from 'react';

import { PlaceContext } from '../Store/PlaceContext';

function Form() {

    const { dispatch } = useContext(PlaceContext);

    const [days, setDays] = useState(0);
    const [location, setLocation] = useState("Berlin");

    const placeTypes = ['Restaurants', "Hotels", "Tourist+attraction"];

    const fetchPlaces = async () => {

        const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        let compiledData = [];

        for (var i = 0; i < placeTypes.length; i++){

            // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
            // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"

            const response = await fetch(`/place/textsearch/json?query=best+${placeTypes[i]}+${location}&key=${googlePlacesApi}`)
            const data = await response.json();
            compiledData.push(data);
        }

        return compiledData;
    }


    const clickHandler = async () => {

        let compiledData = await fetchPlaces();
        dispatch({ type:'SHOW_PLACES', search: {compiledData, days, location}});

    };

    return (
        <div>
            <select className="select-css" id='location' value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="Berlin">Berlin</option>
                <option value="Zurich">Zurich</option>
                <option value="New+York">New York</option>
            </select>
            <input id='number' placeholder='No. of Days' type="text" value={days} onChange={(e) => setDays(e.target.value)}/>
            <button type='submit' onClick={clickHandler}>Submit</button>
        </div>
    );
}

export default Form;

