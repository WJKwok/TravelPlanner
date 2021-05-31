import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import { Image } from 'cloudinary-react';

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: theme.cardWidth,
		maxWidth: theme.cardWidth,
		maxHeight: theme.cardWidth,
		marginRight: 5,
		position: 'relative',
	},
	loggingMedia: {
		width: '100%',
		height: theme.cardWidth * 0.5,
		objectFit: 'cover',
	},
	deleteButton: {
		border: 'solid 1px white',
		position: 'absolute',
		top: 0,
		right: 0,
		padding: 3,
		margin: 2,
	},
	headerThumbnailMedia: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	onlyMedia: {
		width: '100%',
		height: theme.cardWidth,
		objectFit: 'cover',
	},
	onlyMediaInsta: {
		width: '100%',
		height: '100vw',
		objectFit: 'cover',
	},
	media: {
		width: '90%',
		height: theme.cardWidth,
		objectFit: 'cover',
		marginRight: 3,
	},
	mediaInsta: {
		width: '95%',
		height: '100vw',
		objectFit: 'cover',
		marginRight: 3,
	},
}));

const isCloudinaryImage = (url) => {
	const first4Char = url.substring(0, 4);
	const result = first4Char === 'http' || first4Char === 'blob';

	return result;
};

export const LoggingImage = ({ img, deleteHandler, testId }) => {
	const classes = useStyles();
	console.log('uploaded Logging image', img);

	const image = isCloudinaryImage(img) ? (
		<img className={classes.loggingMedia} src={img} />
	) : (
		<Image
			className={classes.loggingMedia}
			cloudName={process.env.REACT_APP_CLOUD_NAME}
			publicId={img}
		/>
	);

	return (
		<div data-testid={testId} key={img} className={classes.root}>
			{image}
			<IconButton
				className={classes.deleteButton}
				data-testid="delete-image"
				onClick={() => deleteHandler(img)}
			>
				<DeleteIcon color="error" />
			</IconButton>
		</div>
	);
};

export const HeaderThumbnail = ({ spotImgUrl }) => {
	const classes = useStyles();

	if (!spotImgUrl) {
		return null;
	}

	const headerThumbnail = isCloudinaryImage(spotImgUrl) ? (
		<img
			data-testid="existing-image"
			key={spotImgUrl}
			className={classes.headerThumbnailMedia}
			src={spotImgUrl}
		/>
	) : (
		<Image
			data-testid="existing-image"
			key={spotImgUrl}
			className={classes.headerThumbnailMedia}
			cloudName={process.env.REACT_APP_CLOUD_NAME}
			publicId={spotImgUrl}
		/>
	);

	return headerThumbnail;
};

export const SpotCardImages = ({ spotImgUrl, instaStyle = false }) => {
	const classes = useStyles();
	let spotCardImages;

	if (spotImgUrl.length === 0) {
		return null;
	}

	if (spotImgUrl.length === 1) {
		spotCardImages = isCloudinaryImage(spotImgUrl[0]) ? (
			<img className={classes.onlyMedia} src={spotImgUrl[0]} />
		) : (
			<Image
				data-testid="existing-image"
				className={instaStyle ? classes.onlyMediaInsta : classes.onlyMedia}
				cloudName={process.env.REACT_APP_CLOUD_NAME}
				publicId={spotImgUrl[0]}
			/>
		);
	}

	if (spotImgUrl.length > 1) {
		spotCardImages = spotImgUrl.map((img) => {
			const image = isCloudinaryImage(img) ? (
				<img
					data-testid="existing-image"
					className={instaStyle ? classes.mediaInsta : classes.media}
					key={img}
					src={img}
				/>
			) : (
				<Image
					data-testid="existing-image"
					key={img}
					className={instaStyle ? classes.mediaInsta : classes.media}
					cloudName={process.env.REACT_APP_CLOUD_NAME}
					publicId={img}
				/>
			);
			return image;
		});
	}

	return spotCardImages;
};
