import React, { useContext, useState } from 'react';

import { AuthContext, SpotContext } from 'Store';

import {
	AuthModal,
	PlannerPlaceAutoComplete,
	ListScraperDialog,
} from 'Components';

import ListIcon from '@material-ui/icons/List';
import SaveIcon from '@material-ui/icons/Save';
import WebIcon from '@material-ui/icons/Web';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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

export const LeftButtonGroup = () => {
	const classes = useStyles();
	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(SpotContext);

	const theme = useTheme();
	const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);
	const isLoggedIn = !authState.user;

	const [registerOpen, setRegisterOpen] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [listScraperOpen, setListScraperOpen] = useState(false);

	return (
		<>
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
					<Button id="save" onClick={() => setRegisterOpen(true)}>
						<SaveIcon />
					</Button>
				)}
				{!isMobile && (
					<Button id="save" onClick={() => setListScraperOpen(true)}>
						<WebIcon />
					</Button>
				)}
				{isMobile && (
					<Button
						id="list"
						onClick={() =>
							dispatch({ type: 'SWITCH_VIEW', payload: { view: 'LIST' } })
						}
					>
						<ListIcon />
					</Button>
				)}
			</ButtonGroup>
			<AuthModal
				registerOpen={registerOpen}
				setRegisterOpen={setRegisterOpen}
			/>
			<PlannerPlaceAutoComplete
				searchModalOpen={searchModalOpen}
				setSearchModalOpen={setSearchModalOpen}
			/>
			<ListScraperDialog
				listScraperOpen={listScraperOpen}
				setListScraperOpen={setListScraperOpen}
			/>
		</>
	);
};
