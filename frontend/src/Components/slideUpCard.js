import React, { useState } from 'react';
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

const useStyles = makeStyles((theme) => ({
	sidePanel: (props) => ({
		position: 'absolute',
		bottom: 0,
		left: 0,
		backgroundColor: 'white',
		height: '100vh',
		width: '100vw',
		zIndex: 10,
	}),
	card: {
		height: 'inherit',
		overflowY: 'auto',
	},
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
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

export const SidePanelCard = ({ spot, showSidePanel, children }) => {
	const styleProps = { showSidePanel };
	const classes = useStyles(styleProps);

	return (
		<>
			{showSidePanel && (
				<div className={classes.sidePanel}>
					{children}
					<Card elevation={0} className={classes.card}>
						<CardActionArea>
							<div className={classes.mediaCards}>
								<SpotCardImages spotImgUrl={spot.imgUrl} />
							</div>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									{spot.place.name}
								</Typography>
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
								<Typography variant="body2">{spot.place.address}</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="primary">
								Share
							</Button>
							<Button size="small" color="primary">
								Learn More
							</Button>
						</CardActions>
					</Card>
				</div>
			)}
		</>
	);
};
