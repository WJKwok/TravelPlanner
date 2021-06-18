import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

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

	const {
		loading,
		error,
		data: { getGuide: guideData } = {},
	} = useQuery<GuideData, GuideVars>(GET_GUIDE, {
		skip: tripId,
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
