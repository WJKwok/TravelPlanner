import { useApolloClient } from '@apollo/client';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';

//this is needed because getTrip and getData are conditionally run (look at their skip variable)
//if getTrip is run, it has guideData within

export const useGetGuideData = () => {
	let { guideBookId } = useParams();
	const client = useApolloClient();

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
