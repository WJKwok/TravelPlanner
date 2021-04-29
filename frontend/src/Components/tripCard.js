import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	makeStyles,
} from '@material-ui/core';

import ShareDialog from './shareDialog';

const useStyles = makeStyles((theme) => ({
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
}));

export const TripCard = ({ trip, deleteHandler }) => {
	const classes = useStyles();

	const [dialogOpen, setDialogOpen] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const cardLink =
		process.env.REACT_APP_NEW_UI === 'true'
			? `/web/planner/${trip.guide.id}/${trip.id}`
			: `/planner/${trip.guide.id}/${trip.id}`;

	console.log('new ui?', process.env.REACT_APP_NEW_UI);
	console.log('node env?', process.env.NODE_ENV);
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
					{process.env.REACT_APP_NEW_UI === 'true' ? (
						<Typography variant="subtitle1">
							{trip.likedSpots.length} Spots
						</Typography>
					) : (
						<Typography data-testid="trip-date" variant="subtitle1">
							{moment(trip.startDate).format('DD MMM')} -{' '}
							{moment(trip.startDate)
								.add(trip.dayLists.length - 1, 'days')
								.format('DD MMM')}
						</Typography>
					)}
				</CardContent>
			</Link>
			<div>
				<MoreVertIcon
					data-testid="more-actions"
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
					<MenuItem
						onClick={() => {
							console.log('share button clicked');
							setDialogOpen(true);
							handleMenuClose();
						}}
					>
						Share
					</MenuItem>
					<MenuItem
						data-testid="delete-trip"
						onClick={() => {
							deleteHandler(trip.id);
							handleMenuClose();
						}}
					>
						Delete
					</MenuItem>
				</Menu>
			</div>
			<ShareDialog open={dialogOpen} setOpen={setDialogOpen} trip={trip} />
		</Card>
	);
};

{
	/* <Typography data-testid="trip-date" variant="subtitle1">
        {moment(trip.startDate).format('DD MMM')} -{' '}
        {moment(trip.startDate)
            .add(trip.dayLists.length - 1, 'days')
            .format('DD MMM')}
    </Typography> */
}
