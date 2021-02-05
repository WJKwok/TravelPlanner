import React, { createContext, useState } from 'react';

const LoggerContext = createContext();

const LoggerContextProvider = (props) => {
	const [clickedCard, setClickedCard] = useState({
		categories: [],
		content: '',
		date: '',
		eventName: '',
		guide: '',
		id: '',
		imgUrl: [],
		place: {
			address: '',
			businessStatus: '',
			hours: [],
			id: '',
			location: [],
			name: '',
			rating: 0,
			userRatingsTotal: 0,
		},
	});
	return (
		<LoggerContext.Provider value={{ clickedCard, setClickedCard }}>
			{props.children}
		</LoggerContext.Provider>
	);
};

export { LoggerContext, LoggerContextProvider };
