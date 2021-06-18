import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

import { AuthContext, SpotContext, SnackBarContext } from 'Store';

import AppBar from '../Components/appBar';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import LinearProgress from '@material-ui/core/LinearProgress';

import { europeanCountries, flagDict } from '../utils/flags';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import ShareDialog from '../Components/shareDialog';
import { TripCard } from '../Components/tripCard';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 0,
		[theme.breakpoints.down(430)]: {
			padding: '0px 16px',
		},
	},
	greeting: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingBottom: 20,
	},
	flags: {
		display: 'flex',
		flexWrap: 'wrap',
	},
}));

const flagStyles = makeStyles((theme) => ({
	flag: (props) => ({
		fontSize: '2em',
		marginRight: 5,
		marginBottom: 5,
		backgroundColor: props.color,
	}),
	overlay: {
		opacity: 0.2,
	},
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
}));

function Trips() {
	const { authState, dispatch: authDispatch } = useContext(AuthContext);
	const { dispatch: placeDispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const visitedCountries = [
		{ name: 'Germany', progress: 40 },
		{ name: 'Netherlands', progress: 70 },
		{ name: 'Belgium', progress: 100 },
		{ name: 'Greece', progress: 20 },
	];
	const remainingCountries = europeanCountries.filter(
		(country) => !visitedCountries.includes(country.name)
	);

	const FlagComponent = ({ flag, visited, countryName, progress }) => {
		let color = 'white';

		if (progress) {
			if (progress === 100) {
				color = '#FFD700';
			} else if (progress >= 50) {
				color = '#C0C0C0';
			} else {
				color = '#cd7f32';
			}
		}

		const styleProps = {
			color,
		};
		console.log('color:', color, progress);
		const classes = flagStyles(styleProps);
		const [anchorEl, setAnchorEl] = React.useState(null);

		const handlePopoverOpen = (event) => {
			setAnchorEl(event.currentTarget);
		};

		const handlePopoverClose = () => {
			setAnchorEl(null);
		};

		const open = Boolean(anchorEl);

		return (
			<>
				<Avatar
					className={classes.flag}
					onMouseEnter={handlePopoverOpen}
					onMouseLeave={handlePopoverClose}
				>
					<p className={visited ? null : classes.overlay}>{flag}</p>
				</Avatar>
				<Popover
					id="mouse-over-popover"
					className={classes.popover}
					classes={{
						paper: classes.paper,
					}}
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography>{countryName}</Typography>
					<LinearProgress
						variant="determinate"
						value={visited ? progress : 0}
					/>
				</Popover>
			</>
		);
	};

	const classes = useStyles();

	const { data: { getUserTrips: trips } = {} } = useQuery(GET_USER_TRIPS, {
		variables: {
			userId: authState.user.id,
		},
	});

	const greetingName = authState.user.username.split(' ')[0];
	const handleLogout = () => {
		authDispatch({ type: 'LOGOUT' });
		placeDispatch({ type: 'CLEAR_STATE' });
		setSnackMessage({ text: 'Logout Success!', code: 'Confirm' });
	};

	const [deleteTrip] = useMutation(DELETE_TRIP, {
		update(proxy, result) {
			console.log('done:', result.data.deleteTrip);

			const data = proxy.readQuery({
				query: GET_USER_TRIPS,
				variables: {
					userId: authState.user.id,
				},
			});

			proxy.writeQuery({
				query: GET_USER_TRIPS,
				variables: {
					userId: authState.user.id,
				},
				data: {
					getUserTrips: data.getUserTrips.filter(
						(i) => i.id !== result.data.deleteTrip
					),
				},
			});
		},
		onError(err) {
			console.log(err);
		},
	});

	const deleteHandler = (tripId) => {
		console.log('is there a trip id?', tripId);
		deleteTrip({ variables: { tripId } });
	};

	const tripCards = trips
		? trips
				.filter((trip) => trip.sharedWith.length === 0)
				.map((trip) => (
					<TripCard
						key={trip.id}
						user={authState.user}
						trip={trip}
						deleteHandler={deleteHandler}
					/>
				))
		: '';

	const sharedTripCards = trips
		? trips
				.filter((trip) => trip.sharedWith.length !== 0)
				.map((trip) => (
					<TripCard
						key={trip.id}
						user={authState.user}
						trip={trip}
						deleteHandler={deleteHandler}
					/>
				))
		: '';

	return (
		<div className={classes.root}>
			<AppBar offset={true} />
			<div className={classes.greeting}>
				<Typography variant="h4">
					Hi {greetingName.charAt(0).toUpperCase() + greetingName.slice(1)} 🙃
				</Typography>
				<Button
					variant="outlined"
					color="default"
					className={classes.button}
					onClick={handleLogout}
				>
					Logout 👋🏻
				</Button>
			</div>
			<div id="personalTrips">{tripCards}</div>
			{sharedTripCards.length > 0 && (
				<>
					<Typography variant="h5">Shared</Typography>
					{sharedTripCards}
				</>
			)}
			<Link to={'/'}>
				<IconButton
					disableRipple={true}
					disableFocusRipple={true}
					onClick={() => placeDispatch({ type: 'CLEAR_STATE' })}
				>
					<AddCircleOutlineRoundedIcon fontSize="large" />
				</IconButton>
			</Link>
			<p>
				European Countries visited: {visitedCountries.length} /{' '}
				{remainingCountries.length}
			</p>
			<div className={classes.flags}>
				{visitedCountries
					.sort((a, b) => b.progress - a.progress)
					.map((country) => (
						<FlagComponent
							key={country.name}
							flag={flagDict[country.name]}
							visited={true}
							countryName={country.name}
							progress={country.progress}
						/>
					))}
				{remainingCountries.map((country) => (
					<FlagComponent
						key={country}
						flag={flagDict[country]}
						visited={false}
						countryName={country}
					/>
				))}
			</div>
		</div>
	);
}

const GET_USER_TRIPS = gql`
	query getUserTrips($userId: ID!) {
		getUserTrips(userId: $userId) {
			id
			user {
				email
				username
			}
			guide {
				id
				coverImage
				city
			}
			dayLists
			startDate
			likedSpots
			sharedWith
		}
	}
`;

const DELETE_TRIP = gql`
	mutation deleteTrip($tripId: ID!) {
		deleteTrip(tripId: $tripId)
	}
`;

export default Trips;
