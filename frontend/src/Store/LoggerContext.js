import React, { createContext, useState } from 'react';

const LoggerContext = createContext();

const emptyClickedCardState = {
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
};

const LoggerContextProvider = (props) => {
	const [clickedCard, setClickedCard] = useState(emptyClickedCardState);
	return (
		<LoggerContext.Provider value={{ clickedCard, setClickedCard }}>
			{props.children}
		</LoggerContext.Provider>
	);
};

export { LoggerContext, LoggerContextProvider, emptyClickedCardState };
