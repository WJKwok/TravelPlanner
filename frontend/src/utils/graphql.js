import { gql } from '@apollo/client';

export const SPOT_DATA = gql`
	fragment SpotData on Spot {
		id
		guide
		place {
			id
			name
			rating
			userRatingsTotal
			location
			hours
			businessStatus
			internationalPhoneNumber
			website
			address
			reviews
		}
		categories
		imgUrl
		content
		date
		eventName
	}
`;
