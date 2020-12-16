import React, { createContext, useState } from 'react';

const LoggerContext = createContext();

const LoggerContextProvider = (props) => {
	const [clickedCard, setClickedCard] = useState({});
	return (
		<LoggerContext.Provider value={{ clickedCard, setClickedCard }}>
			{props.children}
		</LoggerContext.Provider>
	);
};

export { LoggerContext, LoggerContextProvider };
