import React, { useState, useContext } from 'react';
import { SpotContext } from '../Store/SpotContext';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { SpotCardImagesInstaStyle } from './loggingImage';
import marked from 'marked';
import { set } from 'react-ga';
import { iconDict } from './spotIcons';

const useStyles = makeStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: 16,
		paddingBottom: 3,
	},
	icon: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: 0,
		fontSize: '1.5em',
		marginRight: 5,
		backgroundColor: 'lightgrey',
		height: 30,
		width: 30,
		borderRadius: '50%',
	},
	spotTitle: {
		marginBottom: 0,
	},
	spotCategories: {
		marginBottom: 0,
		fontSize: '0.8em',
	},
	card: {
		marginBottom: 10,
	},
	cardContent: {
		padding: '0px 16px 2em 16px',
	},
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	contentDiv: {
		paddingBottom: '1em',
	},
	hideContent: {
		display: 'none',
	},
	likeButton: {
		padding: '0.5em 0em',
	},
}));

//to get link in marked.js to open in a new tab
const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
	const html = linkRenderer.call(renderer, href, title, text);
	return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

export const ListCard = ({ spotId }) => {
	const classes = useStyles();
	const { dispatch, spotState } = useContext(SpotContext);
	const spot = spotState.spots[spotId];
	const [hidePreview, setHidePreview] = useState(false);

	const likeClickHandler = (e) => {
		e.stopPropagation();
		dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spotId } });
	};

	const previewContent = spot.content.slice(0, 100) + '... more';

	return (
		<Card className={classes.card} square elevation={0}>
			<div className={classes.header}>
				<div className={classes.icon}>
					<p>
						{iconDict[spot.categories[0]]
							? iconDict[spot.categories[0]]
							: iconDict.Default}
					</p>
				</div>
				<div>
					<p className={classes.spotTitle}>{spot.place.name}</p>
					<p className={classes.spotCategories}>{spot.categories.join(', ')}</p>
				</div>
			</div>
			<div className={classes.mediaCards}>
				<SpotCardImagesInstaStyle spotImgUrl={spot.imgUrl} />
			</div>
			<div className={classes.cardContent}>
				<div className={classes.likeButton} onClick={likeClickHandler}>
					{spot.liked ? (
						<FavoriteIcon color="error" data-testid="filled-heart" />
					) : (
						<FavoriteBorderIcon data-testid="hollow-heart" />
					)}
				</div>
				<div className={classes.contentDiv}>
					<div
						className={hidePreview ? classes.hideContent : null}
						onClick={() => setHidePreview(true)}
						dangerouslySetInnerHTML={{
							__html: marked(previewContent, { renderer }),
						}}
					/>
					<div
						className={hidePreview ? null : classes.hideContent}
						dangerouslySetInnerHTML={{
							__html: marked(spot.content, { renderer }),
						}}
					/>
				</div>
				{spot.place.website && (
					<a target="_blank" href={spot.place.website}>
						Website
					</a>
				)}
				<Typography variant="body2">
					{spot.place.internationalPhoneNumber}
				</Typography>
				<Typography variant="body2">{spot.place.address}</Typography>
			</div>
		</Card>
	);
};
