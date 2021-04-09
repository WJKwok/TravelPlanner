import React, { createContext, useReducer } from 'react';
import { initialData } from './initial-data';
import { spotReducer } from './spotReducer';

export const SpotContext = createContext();

const SpotContextProvider = (props) => {
	const [spotState, dispatch] = useReducer(spotReducer, initialData);
	return (
		<SpotContext.Provider value={{ spotState, dispatch }}>
			{props.children}
		</SpotContext.Provider>
	);
};

export default SpotContextProvider;
