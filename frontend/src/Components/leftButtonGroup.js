import React from 'react';
import ListIcon from '@material-ui/icons/List';
import SaveIcon from '@material-ui/icons/Save';
import Icon from '@material-ui/core/Icon';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles((theme) => ({
	iconButton: {
		backgroundColor: 'white',
		color: 'black',
		'&:focus': {
			outline: 'none',
		},
	},
	imageIcon: {
		display: 'flex',
		height: 'inherit',
		width: 'inherit',
	},
	iconRoot: {
		textAlign: 'center',
	},
}));

export const LeftButtonGroup = ({
	isLoggedIn,
	isMobile,
	saveItinerary,
	setSearchModalOpen,
	setIsListView,
}) => {
	const classes = useStyles();

	return (
		<ButtonGroup
			variant="contained"
			aria-label="contained primary button group"
			classes={{
				groupedContained: classes.iconButton,
			}}
		>
			<Button
				data-testid="google-search-button"
				onClick={() => setSearchModalOpen(true)}
			>
				<Icon classes={{ root: classes.iconRoot }}>
					<img className={classes.imageIcon} src="/images/search.png" />
				</Icon>
			</Button>
			{isLoggedIn && (
				<Button id="save" onClick={saveItinerary}>
					<SaveIcon />
				</Button>
			)}
			{isMobile && (
				<Button id="list" onClick={() => setIsListView(true)}>
					<ListIcon />
				</Button>
			)}
		</ButtonGroup>
	);
};
