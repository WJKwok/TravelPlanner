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
	image: {
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
}));

export const LoggingImageUploaded = ({ img, deleteHandler, testId }) => {
	const classes = useStyles();

	return (
		<div key={img} data-testid="uploadedImage" className={classes.root}>
			<img src={img} className={classes.image} />
			<IconButton
				className={classes.deleteButton}
				onClick={() => deleteHandler(img)}
			>
				<DeleteIcon color="error" />
			</IconButton>
		</div>
	);
};

export const LoggingImageExisting = ({ img, deleteHandler }) => {
	const classes = useStyles();

	const image =
		img.substring(0, 4) === 'http' ? (
			<img className={classes.image} src={img} />
		) : (
			<Image
				className={classes.image}
				cloudName={process.env.REACT_APP_CLOUD_NAME}
				publicId={img}
			/>
		);

	return (
		<div data-testid="edit-existing-image" key={img} className={classes.root}>
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
