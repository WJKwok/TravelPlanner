import React from 'react';

import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
	review: {
		marginBottom: '1em',
	},
	reviewHeader: {
		display: 'flex',
		alignItems: 'center',
		paddingBottom: 8,
	},
	smallAvatar: {
		marginRight: 5,
		width: 30,
		height: 30,
	},
	authorName: {
		fontSize: '1em',
		lineHeight: 1,
	},
	ratingAndDate: {
		display: 'flex',
		alignItems: 'center',
	},
	date: {
		paddingLeft: 5,
		fontSize: '0.7em',
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
							variant="rounded"
							src={review.profile_photo_url}
							className={classes.smallAvatar}
						/>
						<div>
							<Typography className={classes.authorName}>
								{review.author_name}
							</Typography>

							<div className={classes.ratingAndDate}>
								<Rating
									value={review.rating}
									precision={0.5}
									size="small"
									readOnly
								/>
								<Typography className={classes.date}>
									{moment(review.time * 1000).from(moment())}
								</Typography>
							</div>
						</div>
					</div>

					<Typography variant="body2">{review.text}</Typography>
				</div>
			))}
		</div>
	);
};
