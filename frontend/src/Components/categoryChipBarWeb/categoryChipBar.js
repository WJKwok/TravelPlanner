import React, { useContext } from 'react';
import { SpotContext } from '../../Store/SpotContext';

import { useLazyQuery, gql } from '@apollo/client';
import { SPOT_DATA } from '../../utils/graphql';

import Paper from '@material-ui/core/Paper';
import { iconDict } from '../../Components/spotIcons';
import { makeStyles } from '@material-ui/core';
import CategoryChip from './categoryChip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import SnackBar from '../snackBar';
import { useGetGuideData } from 'graphqlHooks/useGetGuideData';
const useStyles = makeStyles((theme) => ({
	chipRow: {
		display: 'flex',
		overflowX: 'auto',
		listStyle: 'none',
		paddingLeft: 3,
		alignItems: 'flex-start',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	categoryChipBoard: {
		display: 'flex',
		alignItems: 'center',
		padding: '3px 0px 3px 0px',
		marginBottom: 0,
	},
	heartButton: {
		borderRight: '1px solid darkgrey',
		padding: 5,
		cursor: 'pointer',
	},
}));

const CategoryChipBar = ({ hideOnlyLikedButton }) => {
	const classes = useStyles();
	const { dispatch, spotState } = useContext(SpotContext);

	const { guideData } = useGetGuideData();

	let categories = guideData.categories.map((category) => {
		return {
			key: category,
			label: category,
			icon: iconDict[category] ? iconDict[category] : iconDict.Default,
			clicked: spotState.clickedCategories.includes(category) ? true : false,
		};
	});

	const showOnlyLiked = () => {
		dispatch({
			type: 'NEW_CLICKED_CATEGORIES',
			payload: { newClickedCategories: [] },
		});
	};

	const toggleChipHandler = (clickedChip) => {
		const currentClickedCategories = spotState.clickedCategories;
		let newClickedCategories = [];
		if (currentClickedCategories.includes(clickedChip.label)) {
			newClickedCategories = currentClickedCategories.filter(
				(el) => el !== clickedChip.label
			);
		} else {
			newClickedCategories = [...currentClickedCategories, clickedChip.label];
			if (!spotState.queriedCategories.includes(clickedChip.label)) {
				getSpotsForCategoryInGuide({
					variables: {
						guideId: guideData.id,
						category: clickedChip.label,
					},
				});
			}
		}

		dispatch({
			type: 'NEW_CLICKED_CATEGORIES',
			payload: { newClickedCategories },
		});
	};

	const [getSpotsForCategoryInGuide, { variables }] = useLazyQuery(GET_SPOTS, {
		onCompleted({ getSpotsForCategoryInGuide }) {
			console.log('getSpotsForCategoryInGuideVariables', variables);
			dispatch({
				type: 'ADD_SPOTS',
				payload: {
					newSpots: getSpotsForCategoryInGuide,
					categories: [variables.category],
				},
			});
		},
	});

	return (
		<>
			<Paper
				component="ul"
				className={classes.categoryChipBoard}
				square
				elevation={0}
			>
				{!hideOnlyLikedButton && (
					<Tooltip title="Show only liked spots" arrow>
						<div className={classes.heartButton} onClick={showOnlyLiked}>
							<FavoriteIcon color="error" />
						</div>
					</Tooltip>
				)}
				<div className={classes.chipRow}>
					{categories.map((data) => {
						return (
							<li key={data.key}>
								<CategoryChip
									data={data}
									toggleChipHandler={toggleChipHandler}
								/>
							</li>
						);
					})}
				</div>
			</Paper>
			<SnackBar />
		</>
	);
};

export default CategoryChipBar;

const GET_SPOTS = gql`
	query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
		getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;
