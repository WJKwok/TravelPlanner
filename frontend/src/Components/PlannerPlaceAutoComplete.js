import React, { useContext } from 'react';
import { SnackBarContext, SpotContext } from 'Store';
import { useGetSpot, useGetGuideData } from 'graphqlHooks';

import { Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PlaceAutoComplete } from 'Components';
import { reshapeGoogleObject } from 'utils/reshapeGoogleObject';

const useStyles = makeStyles((theme) => ({
	searchDialogSize: {
		minHeight: 300,
		padding: '13px',
	},
}));

export const PlannerPlaceAutoComplete = ({
	searchModalOpen,
	setSearchModalOpen,
}) => {
	const { spotState, dispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);
	const getSpot = useGetSpot();
	const classes = useStyles();

	const { guideData } = useGetGuideData();

	const searchedItemClicked = (searchedItem) => {
		setSearchModalOpen(false);
		for (var key in spotState.spots) {
			if (spotState.spots[key].place.id === searchedItem.id) {
				console.log('STOP DO NOT ADD');
				dispatch({
					type: 'HIGHLIGHT_EXISTING_ITEM',
					payload: { searchedItem: spotState.spots[key] },
				});
				setSnackMessage({ text: 'Item already exists', code: 'Info' });
				return;
			}
		}

		const reshapedItem = reshapeGoogleObject(searchedItem);

		getSpot({
			variables: {
				guideId: guideData.id,
				placeId: searchedItem.id,
				searchedItem: reshapedItem,
			},
		});
	};

	const placeAutoCompletePlaceHolderText = 'Google a place of interest 🙌';

	return (
		<Dialog
			open={searchModalOpen}
			onClose={() => setSearchModalOpen(false)}
			fullWidth={true}
		>
			<div className={classes.searchDialogSize}>
				<PlaceAutoComplete
					clickFunction={searchedItemClicked}
					city={guideData.city}
					coordinates={guideData.coordinates}
					placeHolderText={placeAutoCompletePlaceHolderText}
				/>
			</div>
		</Dialog>
	);
};
