import { useQuery, gql } from '@apollo/client';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SpotContext } from 'Store/SpotContext';

interface Guide {
	id: string;
	name: string;
	city: string;
	coordinates: [number, number];
	coverImage: string;
	plannerImage: string;
	categories: [string];
	logo: string;
}

interface GuideData {
	getGuide: Guide;
}

interface GuideVars {
	guideId: string;
}

export const useGuide = () => {
	let { guideBookId, tripId } = useParams();
	const { dispatch } = useContext(SpotContext);

	const {
		loading,
		error,
		data: { getGuide: guideData } = {},
	} = useQuery<GuideData, GuideVars>(GET_GUIDE, {
		skip: tripId,
		onCompleted({ getGuide }) {
			dispatch({ type: 'LOAD_GUIDE', payload: { guide: getGuide } });
		},
		variables: {
			guideId: guideBookId,
		},
	});

	return { loading, error, guideData };
};

const GET_GUIDE = gql`
	query getGuide($guideId: ID!) {
		getGuide(guideId: $guideId) {
			id
			name
			city
			coordinates
			categories
			plannerImage
			logo
		}
	}
`;
