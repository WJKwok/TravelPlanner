import { client } from 'ApolloProvider';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';

//this is needed because getTrip and getData are conditionally run

export const useGetGuideData = () => {
	let { guideBookId } = useParams();

	const guideData = client.readFragment({
		id: `Guide:${guideBookId}`, // The value of the to-do item's unique identifier
		fragment: gql`
			fragment MyGuide on Guide {
				id
				name
				city
				coordinates
				categories
				plannerImage
			}
		`,
	});

	return { guideData };
};
