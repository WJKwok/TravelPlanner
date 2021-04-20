import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

import { AuthContext } from '../Store/AuthContext';
import { SpotContext } from '../Store/SpotContext';
import { SnackBarContext } from '../Store/SnackBarContext';

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

import { europeanCountries, flagDict } from '../utils/flags';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

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
	tripCard: {
		marginBottom: 15,
		display: 'flex',
	},
	headerThumbnail: {
		width: 100,
	},
	headerTitle: {
		flex: 1,
	},
	menuButton: {
		margin: '10px 5px',
		cursor: 'pointer',
	},
	flags: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	flag: {
		fontSize: '2em',
		marginRight: 5,
		marginBottom: 5,
		backgroundColor: 'antiquewhite',
	},
	overlay: {
		opacity: 0.2,
	},
}));

function Trips() {
	const { authState, dispatch: authDispatch } = useContext(AuthContext);
	const { dispatch: placeDispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const visitedCountries = ['Germany', 'Netherlands', 'Belgium', 'Greece'];
	const remainingCountries = europeanCountries.filter(
		(country) => !visitedCountries.includes(country)
	);

	const FlagComponent = ({ flag, visited, countryName }) => {
		return (
			<Tooltip title={countryName} arrow>
				<Avatar className={classes.flag}>
					<p className={visited ? null : classes.overlay}>{flag}</p>
				</Avatar>
			</Tooltip>
		);
	};

	const classes = useStyles();

	const { loading, data: { getUserTrips: trips } = {} } = useQuery(
		GET_USER_TRIPS,
		{
			variables: {
				userId: authState.user.id,
			},
		}
	);

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

	console.log(trips);
	const tripCards = loading
		? ''
		: trips.map((trip) => {
				console.log(
					'process.env.REACT_APP_NEW_UI',
					process.env.REACT_APP_NEW_UI
				);
				const cardLink = process.env.REACT_APP_NEW_UI
					? `web/planner/${trip.guide.id}/${trip.id}`
					: `/planner/${trip.guide.id}/${trip.id}`;
				return (
					<Card
						className={classes.tripCard}
						key={trip.id}
						data-testid={`tripCard-${trip.id}`}
					>
						<Link
							to={cardLink}
							style={{ textDecoration: 'none', display: 'flex', flex: 1 }}
						>
							<CardMedia
								className={classes.headerThumbnail}
								image={trip.guide.coverImage}
							/>

							<CardContent className={classes.headerTitle}>
								<Typography variant="h5">{trip.guide.city}</Typography>
								<Typography variant="subtitle1">
									{trip.likedSpots.length} Spots
								</Typography>
								{/* <Typography data-testid="trip-date" variant="subtitle1">
									{moment(trip.startDate).format('DD MMM')} -{' '}
									{moment(trip.startDate)
										.add(trip.dayLists.length - 1, 'days')
										.format('DD MMM')}
								</Typography> */}
							</CardContent>
						</Link>
						<div>
							<MoreVertIcon
								aria-controls="simple-menu"
								aria-haspopup="true"
								onClick={handleMenuClick}
								className={classes.menuButton}
							/>
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
							>
								<MenuItem onClick={handleMenuClose}>Share</MenuItem>
								<MenuItem
									onClick={() => {
										deleteHandler(trip.id);
										handleMenuClose();
									}}
								>
									Delete
								</MenuItem>
							</Menu>
						</div>
					</Card>
				);
		  });

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

			{tripCards}
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
				{visitedCountries.map((country) => (
					<FlagComponent
						flag={flagDict[country]}
						visited={true}
						countryName={country}
					/>
				))}
				{remainingCountries.map((country) => (
					<FlagComponent
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
			guide {
				id
				coverImage
				city
			}
			dayLists
			startDate
			likedSpots
		}
	}
`;

const DELETE_TRIP = gql`
	mutation deleteTrip($tripId: ID!) {
		deleteTrip(tripId: $tripId)
	}
`;

export default Trips;
