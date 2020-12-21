import React, { useState, useContext } from 'react';
import { SpotContext } from '../Store/SpotContext';
import { LoggerContext } from '../Store/LoggerContext';
import moment from 'moment';

import { iconDictWhite, iconColour } from './spotIcons';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardMedia,
	CardContent,
	Collapse,
	Typography,
	IconButton,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { Draggable } from 'react-beautiful-dnd';

import GoogleDirectionLink from './googleDirectionLink';

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: theme.cardWidth,
		maxWidth: theme.cardWidth,
		margin: 5,
		[theme.breakpoints.down(theme.maxMobileWidth)]: {
			minWidth: '75%',
		},
	},
	// rootHighlighted: {
	// 	position: 'relative',
	// 	minWidth: 300,
	// 	margin: 5,
	// 	[theme.breakpoints.down(430)]: {
	// 		minWidth: '75%',
	// 	},
	// 	border: '1px solid grey',
	// },
	header: {
		display: 'flex',
	},
	iconsRow: {
		display: 'flex',
	},
	editButton: {
		cursor: 'pointer',
	},
	catIndex: (props) => ({
		backgroundColor: props.backgroundColor,
		padding: '2px 6px',
		borderRadius: 5,
		color: 'white',
		display: 'inline-flex', //to center icon
		marginRight: 5,
	}),
	index: {
		paddingLeft: 3,
		fontWeight: 600,
	},
	spotTitle: {
		fontSize: '1.2em',
		lineHeight: 'normal',
		padding: '5px 0px',
	},
	spotSubtitle: {
		marginRight: 5,
		fontSize: '0.9em',
	},
	spotEventWrongDay: {
		display: 'inline-block',
		backgroundColor: 'red',
		color: 'white',
		fontSize: '0.9em',
		padding: '0px 3px',
		borderRadius: '3px',
	},
	headerThumbnail: {
		minWidth: 90,
		objectFit: 'cover',
	},
	ratingDiv: {
		display: 'flex',
		alignItems: 'center',
	},
	collapseContent: {
		maxHeight: 200,
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	onlyMedia: {
		width: '100%',
		height: theme.cardWidth * 0.5,
		objectFit: 'cover',
	},
	media: {
		// height: 0,
		width: '90%',
		height: theme.cardWidth * 0.5,
		objectFit: 'cover',
		marginRight: 3,
		// paddingBottom: '75%',
		// paddingTop: '56.25%', // 16:9
	},
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		overflowX: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
}));

const SpotCard = React.memo((props) => {
	const {
		spot,
		index,
		date,
		day,
		highlight,
		mouseOver,
		dragAndDroppable,
	} = props;
	console.log(`me am rendered ${index}`);
	//const placeImgUrl = "/place/photo?maxheight=400&photoreference=" + place.photoRef + "&key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

	const { dispatch } = useContext(SpotContext);
	const { setClickedCard } = useContext(LoggerContext);
	const cssProps = { backgroundColor: iconColour[spot.category] };
	const classes = useStyles(cssProps);
	const [expanded, setExpanded] = useState(props.expanded);
	const [liked, setLiked] = useState(spot.liked);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const editClickHandler = (e) => {
		e.stopPropagation();
		setClickedCard(spot);
	};

	const likeClickHandler = (e) => {
		e.stopPropagation();
		setLiked(!liked);
		dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spot.id } });
	};

	const trimDayText = (dayText) => {
		const dayAndHoursArray = dayText.split('day');
		const trimmedDayText =
			dayAndHoursArray[0].slice(0, 3) + dayAndHoursArray[1];
		return trimmedDayText;
	};

	const isEventOnRightDayBoard = (date, spot) => {
		// no date prop if in spotsBoard
		if (!date) {
			return true;
		}

		// if not an event card
		if (spot.category !== 'Event') {
			return true;
		}

		if (spot.category === 'Event' && moment(date).isSame(spot.date, 'day')) {
			return true;
		}

		if (spot.category === 'Event' && !moment(date).isSame(spot.date, 'day')) {
			return false;
		}
	};

	const dayToArrayIndex = day === 0 ? 6 : day - 1;

	const businessStatus =
		spot.place.businessStatus === 'OPERATIONAL'
			? spot.place.hours
				? trimDayText(spot.place.hours[dayToArrayIndex])
				: 'Hours Null'
			: spot.place.businessStatus;

	const eventIsOnRightDayBoard = isEventOnRightDayBoard(date, spot);
	const cardHeader =
		spot.category === 'Event' ? (
			<>
				<Typography className={classes.spotTitle}>{spot.eventName}</Typography>
				<Typography
					data-testid="event-card-date"
					className={
						eventIsOnRightDayBoard
							? classes.spotSubtitle
							: classes.spotEventWrongDay
					}
				>
					{moment(spot.date).format('Do MMM YYYY')}
				</Typography>
				<Typography className={classes.spotSubtitle}>
					{spot.place.name}
				</Typography>
			</>
		) : (
			<>
				<Typography className={classes.spotTitle}>{spot.place.name}</Typography>
				<Typography
					data-testid="business-status"
					className={classes.spotSubtitle}
				>
					{businessStatus}
				</Typography>
				<div className={classes.ratingDiv}>
					<Typography className={classes.spotSubtitle}>
						{spot.place.rating}
					</Typography>
					<Rating
						defaultValue={spot.place.rating}
						precision={0.5}
						size="small"
						readOnly
					/>
				</div>
			</>
		);

	return (
		<Draggable
			draggableId={spot.id}
			index={index}
			isDragDisabled={!dragAndDroppable}
		>
			{(provided) => (
				<Card
					id="spot-card"
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={classes.root}
					data-testid={spot.id}
					elevation={highlight ? 24 : 1}
					onMouseEnter={mouseOver ? () => mouseOver(spot.id) : null}
					onMouseLeave={mouseOver ? () => mouseOver(null) : null}
				>
					<div
						className={classes.header}
						onClick={handleExpandClick}
						data-testid="spot-card"
					>
						{expanded ? (
							''
						) : (
							<CardMedia
								className={classes.headerThumbnail}
								image={spot.imgUrl[0]}
							/>
						)}
						<div>
							<CardContent>
								<div className={classes.iconsRow}>
									<div className={classes.catIndex}>
										{iconDictWhite[spot.category]}
										<span className={classes.index}>{index + 1}</span>
									</div>
									{dragAndDroppable ? (
										<div onClick={likeClickHandler}>
											{liked ? (
												<FavoriteIcon
													color="error"
													data-testid="filled-heart"
												/>
											) : (
												<FavoriteBorderIcon data-testid="hollow-heart" />
											)}
										</div>
									) : (
										<div
											className={classes.editButton}
											onClick={editClickHandler}
										>
											<EditOutlinedIcon />
										</div>
									)}
								</div>
								{cardHeader}
							</CardContent>
						</div>
					</div>
					<Collapse
						data-testid={`collapseContent-${spot.id}`}
						className={classes.collapseContent}
						in={expanded}
						timeout="auto"
						unmountOnExit
					>
						<div className={classes.mediaCards}>
							{spot.imgUrl.length > 1 ? (
								spot.imgUrl.map((img) => {
									return <img className={classes.media} key={img} src={img} />;
								})
							) : (
								<img className={classes.onlyMedia} src={spot.imgUrl[0]} />
							)}
						</div>
						{/* <CardMedia className={classes.media} image={spot.imgUrl[0]} /> */}
						{/*  <CardMedia key={img} className={classes.media} image={img} /> */}
						<CardContent>
							<Typography variant="body2" color="textSecondary" component="p">
								{spot.content}
							</Typography>
						</CardContent>
					</Collapse>
					{/* <GoogleDirectionLink place={spot.place}/> */}
				</Card>
			)}
		</Draggable>
	);
});

export default SpotCard;
