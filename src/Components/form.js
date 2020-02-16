import React, { useState, useContext } from 'react';

import { PlaceContext } from '../Store/PlaceContext';

function Form() {

    const { dispatch } = useContext(PlaceContext);

    const [type, setType] = useState('Restaurants');
    const [days, setDays] = useState(0);
    const [location, setLocation] = useState('');


    const clickHandler = async () => {

        // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
        // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"
        const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        const response = await fetch(`/place/textsearch/json?query=${type}+${location}&key=${googlePlacesApi}`)
        const data = await response.json();

        dispatch({ type:'SHOW_PLACES', search: {data, days}});
    
    };

    return (
        <div>
            <select className="select-css" id='type' value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Restaurants">Restaurants</option>
                <option value="Hotels">Hotels</option>
                <option value="Tourist+attraction">Tourist+attraction</option>
            </select>
            <input id='place' placeholder='City' type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
            <input id='number' placeholder='No. of Days' type="text" value={days} onChange={(e) => setDays(e.target.value)}/>
            <button type='submit' onClick={clickHandler}>Submit</button>
        </div>
    );
}

export default Form;

