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
import StarRateIcon from '@material-ui/icons/StarRate';
import marked from 'marked';
import { Divider } from '@material-ui/core';

import { SpotCardImages } from './loggingImage';
import { GoogleReviews } from './googleReviews';
import GoogleDirectionLink from './googleDirectionLink';
import { OpeningHoursAccordion } from './openingHoursAccordion';

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
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    paddingBottom: '2em',
  },
  divider: {
    margin: '15px 0px',
  },
  likeButton: {
    paddingBottom: '1em',
  },
}));

//to get link in marked.js to open in a new tab
const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

export const SlideUpCard = ({ spotId, showSidePanel, children }) => {
  const styleProps = { showSidePanel };
  const classes = useStyles(styleProps);
  const { dispatch, spotState } = useContext(SpotContext);
  const spot = spotState.spots[spotId];

  const likeClickHandler = (e) => {
    e.stopPropagation();
    dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spotId } });
  };

  return (
    <>
      {showSidePanel && (
        <div className={classes.sidePanel}>
          {children}
          <Card elevation={0} className={classes.card} square>
            <div className={classes.mediaCards}>
              <SpotCardImages spotImgUrl={spot.imgUrl} />
            </div>
            <CardContent>
              <div className={classes.likeButton} onClick={likeClickHandler}>
                {spot.liked ? (
                  <FavoriteIcon color="error" data-testid="filled-heart" />
                ) : (
                  <FavoriteBorderIcon data-testid="hollow-heart" />
                )}
              </div>

              <Typography variant="h5">{spot.place.name}</Typography>
              <Typography variant="body2" className={classes.ratingRow}>
                {spot.place.rating}
                <StarRateIcon color="error" data-testid="filled-heart" /> (
                {spot.place.userRatingsTotal})
              </Typography>
              <Typography variant="subtitle1">
                {spot.categories.join(', ')}
              </Typography>
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
          </Card>
        </div>
      )}
    </>
  );
};
