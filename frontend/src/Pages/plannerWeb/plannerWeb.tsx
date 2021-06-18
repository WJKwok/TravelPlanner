import React, { useContext, useState, useEffect } from 'react';

import { SpotContext } from '../../Store/SpotContext';
import { AuthContext } from '../../Store/AuthContext';

import ContentWithinMapWeb from '../../Components/contentWithinMapWeb';
import ContentWithinMapMobile from '../../Components/contentWithinMapMobile';
import { ListPage } from 'Components/listPage';
import ConfirmNavPrompt from '../../Components/confirmNavPrompt';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
	useEditTrip,
	useSubmitTrip,
	useGuide,
	useGetTrip,
	useTripSubscription,
	useGetGuideData,
} from 'graphqlHooks';

function Planner(props) {
	const { authState } = useContext(AuthContext);
	const { spotState, dispatch } = useContext(SpotContext);

	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);

	const [tripId, setTripId] = useState(props.match.params.tripId);
	const submitTrip = useSubmitTrip(setTripId);
	const editTrip = useEditTrip(tripId);

	useGuide();
	useGetTrip();
	useTripSubscription();
	const { guideData } = useGetGuideData();

	useEffect(() => {
		return () => {
			console.log('clearing state...');
			dispatch({ type: 'CLEAR_STATE' });
		};
	}, [dispatch]);

	useEffect(() => {
		//authState.user saves after login
		if (spotState.recentLikeToggledSpotId && authState.user) {
			saveItinerary();
		}
	}, [spotState.recentLikeToggledSpotId, authState.user]);

	const saveItinerary = () => {
		if (!tripId) {
			submitTrip();
		} else {
			editTrip();
		}
	};

	const renderSpotsBoard = () => {
		if (isMobile) {
			if (spotState.view === 'LIST') {
				return <ListPage />;
			} else {
				return <ContentWithinMapMobile />;
			}
		}
		return <ContentWithinMapWeb />;
	};

	return guideData?.id ? (
		<>
			<ConfirmNavPrompt
				when={spotState.unsavedChanges === true}
				navigate={(path) => props.history.push(path)}
			/>
			<div>{renderSpotsBoard()}</div>
		</>
	) : null;
}

export default Planner;

/* to look up cache
import {client} from '../ApolloProvider';

const getFilteredData = () => {
  try {
    let freshFilteredData = []
    for (var i = 0; i < categoryChips.length; i ++){
          if (categoryChips[i].clicked){
          const cachedData = client.readQuery({
            query: GET_SPOTS_FOR_CATEGORY,
            variables: {
                guideId,
                category : categoryChips[i].label}
          })
          freshFilteredData = freshFilteredData.concat(cachedData.getSpotsForCategoryInGuide)
        }
    }
    setFilteredData(freshFilteredData)
    let spots = {}
    let spotIds = [];
    for (var i = 0; i < freshFilteredData.length; i ++ ){
      spots[freshFilteredData[i].id] = freshFilteredData[i];
      spotIds.push(freshFilteredData[i].id)
    }
    orderState.spots = spots;
    orderState.columns["filtered-spots"].spotIds = spotIds
  } catch (err) {
    console.log(err)
  }
}
*/
