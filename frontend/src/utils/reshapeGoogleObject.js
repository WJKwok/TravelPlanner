export const reshapeGoogleObject = (googleObject, scrapedContent = '') => {
	const reshapedObject = {
		__typename: 'Spot',
		categories: ['Searched'],
		content: scrapedContent,
		guide: 'Searched',
		id: googleObject.id,
		imgUrl: ['https://i.imgur.com/zbBglmB.jpg'],
		place: {
			__typename: 'Place',
			id: googleObject.id,
			location: [googleObject.location.lat, googleObject.location.lng],
			name: googleObject.name,
			rating: googleObject.rating,
			userRatingsTotal: googleObject.userRatingsTotal,
			businessStatus: googleObject.businessStatus,
			hours: googleObject.hours,
			reviews: googleObject.reviews,
			internationalPhoneNumber: googleObject.internationalPhoneNumber,
			website: googleObject.website,
			address: googleObject.address,
		},
	};
	return reshapedObject;
};
