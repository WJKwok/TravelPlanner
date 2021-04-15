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
import { SpotCardImages } from './loggingImage';
import marked from 'marked';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarRateIcon from '@material-ui/icons/StarRate';
import Divider from '@material-ui/core/Divider';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';

import { GoogleReviews } from './googleReviews';
import { OpeningHoursAccordion } from './openingHoursAccordion';
import GoogleDirectionLink from './googleDirectionLink';
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
	card: {
		height: 'calc(100vh - 50px)',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
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

export const SidePanelCard = ({ spotId, showSidePanel, children }) => {
	const styleProps = { showSidePanel };
	const classes = useStyles(styleProps);
	const { dispatch, spotState } = useContext(SpotContext);
	const spot = spotState.spots[spotId];
	const likeClickHandler = (e) => {
		e.stopPropagation();
		dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spotId } });
	};

	return (
		<div className={classes.sidePanel}>
			{children}
			<Card elevation={0} className={classes.card} square>
				<SpotCardContent spotId={spotId} />
			</Card>
		</div>
	);
};
