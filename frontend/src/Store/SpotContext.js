import React, { createContext, useReducer } from 'react';
import {initialDataTest} from './initial-data';
import { spotReducer } from './spotReducer';

export const SpotContext = createContext();

const SpotContextProvider = (props) => {
    const [spotState, dispatch] = useReducer(spotReducer, initialDataTest);
    return (
        <SpotContext.Provider value={{spotState, dispatch}}>
            {props.children}
        </SpotContext.Provider>
    );
}

export default SpotContextProvider;