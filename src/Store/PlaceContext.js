import React, { createContext, useReducer } from 'react';
import { placeReducer } from './placeReducer';
import initialData from './initial-data';

//try without export once you get it working
export const PlaceContext = createContext();

const PlaceContextProvider = (props) => {
    const [contextState, dispatch]  = useReducer(placeReducer, initialData);
    return (
        <PlaceContext.Provider value={{ contextState, dispatch }}>
            {props.children}
        </PlaceContext.Provider>
    );
}

export default PlaceContextProvider;