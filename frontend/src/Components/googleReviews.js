import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';

import { OpeningHoursAccordion } from './openingHoursAccordion';

const useStyles = makeStyles((theme) => ({
	review: {
		marginBottom: '1em',
	},
	reviewHeader: {
		display: 'flex',
		alignItems: 'center',
	},
	smallAvatar: {
		marginRight: 5,
	},
}));

export const GoogleReviews = ({ reviews }) => {
	const classes = useStyles();

	const parsedReviews = reviews ? JSON.parse(reviews) : [];
	console.log('parsedReviews:', parsedReviews);

	return (
		<div>
			{parsedReviews.map((review) => (
				<div key={review.time} className={classes.review}>
					<div className={classes.reviewHeader}>
						<Avatar
							src={review.profile_photo_url}
							className={classes.smallAvatar}
						/>
						<div>
							<Typography variant="subtitle1">{review.author_name}</Typography>
							<Rating
								value={review.rating}
								precision={0.5}
								size="small"
								readOnly
							/>
						</div>
					</div>
					<Typography variant="caption">
						{moment(review.time * 1000).from(moment())}
					</Typography>
					<Typography variant="body2">{review.text}</Typography>
				</div>
			))}
		</div>
	);
};
