import React, { createContext, useReducer } from 'react';
import { placeReducer } from './placeReducer';
import initialData from './initial-data';

//try without export once you get it working
export const PlaceContext = createContext();

const PlaceContextProvider = (props) => {
    const [placeState, dispatch]  = useReducer(placeReducer, initialData);
    return (
        <PlaceContext.Provider value={{ placeState, dispatch }}>
            {props.children}
        </PlaceContext.Provider>
    );
}

export default PlaceContextProvider;