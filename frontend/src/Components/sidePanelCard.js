import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

import { SpotCardContent } from './spotCardContent';

const useStyles = makeStyles((theme) => ({
	sidePanel: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: 0,
		backgroundColor: 'white',
		height: '100vh',
		width: props.showSidePanel ? 408 : 0,
		zIndex: 6,
		paddingTop: 37,
		boxShadow: '0 0 20px rgb(0 0 0 / 30%)',
	}),
	toggleSidePanelButton: {
		position: 'absolute',
		zIndex: 5,
		top: 100,
		left: '100%',
		backgroundColor: 'white',
		padding: '10px 0px',
		boxShadow: '0px 1px 4px rgb(0 0 0 / 30%)',
	},
	card: {
		height: 'calc(100vh - 50px)',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
}));

export const SidePanelCard = ({
	spotId,
	showSidePanel,
	onToggleSidePanelButtonClicked,
}) => {
	const styleProps = { showSidePanel };
	const classes = useStyles(styleProps);

	const sidePanelToggleButton = (
		<div
			className={classes.toggleSidePanelButton}
			onClick={onToggleSidePanelButtonClicked}
		>
			{showSidePanel ? <ArrowLeftIcon /> : <ArrowRightIcon />}
		</div>
	);

	return spotId ? (
		<div className={classes.sidePanel} data-testid="side-panel">
			{sidePanelToggleButton}
			<Card elevation={0} className={classes.card} square>
				<SpotCardContent spotId={spotId} />
			</Card>
		</div>
	) : null;
};
