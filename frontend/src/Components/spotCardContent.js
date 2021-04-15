import React, { useContext } from 'react';
import { SpotContext } from '../Store/SpotContext';
import { makeStyles } from '@material-ui/core/styles';

import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import { SpotCardImages } from './loggingImage';
import marked from 'marked';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarRateIcon from '@material-ui/icons/StarRate';
import Divider from '@material-ui/core/Divider';

import { GoogleReviews } from './googleReviews';
import { OpeningHoursAccordion } from './openingHoursAccordion';
import GoogleDirectionLink from './googleDirectionLink';

const useStyles = makeStyles((theme) => ({
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	titleAndFav: {
		display: 'flex',
		paddingBottom: 10,
	},
	spotTitle: {
		flex: 1,
		fontSize: '1.3rem',
	},
	review: {
		marginBottom: '1em',
	},
	ratingRow: {
		display: 'flex',
		alignItems: 'center',
	},
	divider: {
		margin: '15px 0px',
	},
	content: {
		paddingBottom: '2em',
	},
}));

//to get link in marked.js to open in a new tab
const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
	const html = linkRenderer.call(renderer, href, title, text);
	return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

export const SpotCardContent = ({ spotId }) => {
	const classes = useStyles();
	const { dispatch, spotState } = useContext(SpotContext);
	const spot = spotState.spots[spotId];
	const likeClickHandler = (e) => {
		e.stopPropagation();
		dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spotId } });
	};

	return (
		<>
			<div className={classes.mediaCards}>
				<SpotCardImages spotImgUrl={spot.imgUrl} />
			</div>
			<CardContent>
				<div className={classes.titleAndFav}>
					<div className={classes.spotTitle}>{spot.place.name}</div>
					<div onClick={likeClickHandler}>
						{spot.liked ? (
							<FavoriteIcon color="error" data-testid="filled-heart" />
						) : (
							<FavoriteBorderIcon data-testid="hollow-heart" />
						)}
					</div>
				</div>

				<Typography variant="body2" className={classes.ratingRow}>
					{spot.place.rating}
					<StarRateIcon color="error" /> ({spot.place.userRatingsTotal})
				</Typography>
				<Typography variant="body2">{spot.categories.join(', ')}</Typography>

				<Divider className={classes.divider} />
				<OpeningHoursAccordion openingHours={spot.place.hours} />
				<div
					className={classes.content}
					dangerouslySetInnerHTML={{
						__html: marked(spot.content, { renderer }),
					}}
				/>

				{spot.place.website && (
					<a target="_blank" href={spot.place.website}>
						Website
					</a>
				)}
				<Typography variant="body2">
					{spot.place.internationalPhoneNumber}
				</Typography>
				<GoogleDirectionLink place={spot.place}>
					<Typography variant="body2">{spot.place.address}</Typography>
				</GoogleDirectionLink>
				<Divider className={classes.divider} />
				<GoogleReviews reviews={spot.place.reviews} />
			</CardContent>
		</>
	);
};
