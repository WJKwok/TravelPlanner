import React, { createContext, useReducer } from 'react';
import { placeReducer } from './placeReducer';
import {initialData} from './initial-data';


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