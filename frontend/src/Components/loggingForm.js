import React, { useContext, useState, useEffect, useReducer } from 'react';
import { LoggerContext } from '../Store/LoggerContext';
import { SnackBarContext } from '../Store/SnackBarContext';

import { LoggingImageUploaded, LoggingImageExisting } from './loggingImage';
import PlaceAutoComplete from './placeAutoComplete';

import { TextField, MenuItem, Button, IconButton } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import marked from 'marked';

import { useMutation, gql } from '@apollo/client';
import { getPublicIdsOfUploadedImages } from '../Services/cloudinaryApi';

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: 15,
	},
	textField: {
		marginBottom: 8,
		width: '100%',
	},
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	mediaCard: {
		minWidth: theme.cardWidth,
		maxWidth: theme.cardWidth,
		maxHeight: theme.cardWidth,
		marginRight: 5,
		position: 'relative',
	},
	media: {
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
	submitButton: {
		float: 'right',
	},
}));

export const LoggingForm = ({ guide }) => {
	const classes = useStyles();
	const { clickedCard } = useContext(LoggerContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	useEffect(() => {
		if (Object.keys(clickedCard).length > 0) {
			/* can't do 
        setSpotInpoout({
            ...clickedCard,
            ...clickedCard['place'],
            placeId: clickedCard.place.id,
        })

        becuase it would override 'guide'
        */
			setSpotInput({
				categories: clickedCard.categories,
				placeId: clickedCard.place.id,
				name: clickedCard.place.name,
				date: clickedCard.date,
				eventName: clickedCard.eventName,
				rating: clickedCard.place.rating,
				address: clickedCard.place.address,
				location: clickedCard.place.location,
				hours: clickedCard.place.hours,
				imgUrl: clickedCard.imgUrl,
				content: clickedCard.content,
			});
		}
	}, [clickedCard]);

	const initialSpotState = {
		guide: {},
		categories: [],
		placeId: '',
		name: '',
		date: '',
		eventName: '',
		rating: '',
		address: '',
		location: [],
		hours: '',
		imgUrl: [],
		content: '',
	};

	const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
	const [uploadedImgFiles, setUploadedImgFiles] = useState({});
	const [uploadedImageBlobToFile, setUploadedImageBlobToFile] = useState({});
	const [spotInput, setSpotInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialSpotState
	);

	const spotFieldChangeHandler = (e) => {
		const name = e.target.name;
		const newValue = e.target.value;
		setSpotInput({ [name]: newValue });
	};

	const getDetailsFromAutoCompleteItem = (placeObject) => {
		console.log('placeObject', placeObject);
		setSpotInput({
			...placeObject,
			placeId: placeObject.id,
			location: [placeObject.location.lat, placeObject.location.lng],
		});
	};

	const categoryMenu = (guide) => {
		let categoryMenu;

		if (Object.keys(guide).length > 0) {
			categoryMenu = guide.categories.map((category) => (
				<MenuItem key={category} value={category}>
					{category}
				</MenuItem>
			));
			return categoryMenu;
		}

		categoryMenu = <MenuItem>Loading..</MenuItem>;
		return categoryMenu;
	};

	const fileUploadClicked = async (event) => {
		console.log('upload files', event.target.files);
		const uploadedImageBlobToFileCopy = { ...uploadedImageBlobToFile };
		[...event.target.files].forEach((imageFile, index) => {
			console.log('imgfile: ', imageFile);
			const tempUrl = URL.createObjectURL(imageFile);
			uploadedImageBlobToFileCopy[tempUrl] = { index, toUpload: true };
		});
		setUploadedImageBlobToFile(uploadedImageBlobToFileCopy);
		setUploadedImgFiles(event.target.files);
	};

	const deleteExistingImageHandler = (imgUrlToRemove) => {
		const copyImgurl = spotInput.imgUrl;
		const newImgUrl = copyImgurl.filter((item) => item !== imgUrlToRemove);
		setSpotInput({ imgUrl: newImgUrl });
	};

	const deleteUploadedImageHandler = async (imgUrl) => {
		console.log({
			imgUrl,
			uploadedImgFiles,
			uploadedImageBlobToFile,
		});
		const uploadedImageBlobToFileCopy = { ...uploadedImageBlobToFile };
		uploadedImageBlobToFileCopy[imgUrl].toUpload = false;
		setUploadedImageBlobToFile(uploadedImageBlobToFileCopy);
	};

	const uploadedImgPreviewCard = Object.keys(uploadedImageBlobToFile).map(
		(imgLink) => {
			const imgPreview = uploadedImageBlobToFile[imgLink].toUpload ? (
				<LoggingImageUploaded
					img={imgLink}
					deleteHandler={deleteUploadedImageHandler}
				/>
			) : null;
			return imgPreview;
		}
	);

	const [savePlace] = useMutation(SAVE_PLACE, {
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log('err', err);
			//{ graphQLErrors, networkError, ...rest }
			// console.log({ graphQLErrors, networkError, rest });
			// // console.log(networkError);
			// if (graphQLErrors) {
			// 	setSnackMessage({
			// 		text: graphQLErrors[0].message,
			// 		code: 'Error',
			// 	});
			// }
		},
		variables: {
			...spotInput,
			id: spotInput.placeId,
			// name: spotInput.name,
			// rating: spotInput.rating,
			// address: spotInput.address,
			// location: spotInput.location,
		},
	});

	const [saveSpot] = useMutation(SAVE_SPOT, {
		onCompleted() {
			setSnackMessage({
				text: 'Spot Saved!',
				code: 'Confirm',
			});
			setSpotInput(initialSpotState);
			setUploadedImgFiles({});
			setUploadedImageBlobToFile({});
			setSubmitButtonClicked(false);
		},
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log('err', err);
			//{ graphQLErrors, networkError, ...rest }
			// console.log({ graphQLErrors, networkError, rest });
			// if (graphQLErrors) {
			// 	setSnackMessage({
			// 		text: graphQLErrors[0].message,
			// 		code: 'Error',
			// 	});
			// }
		},
	});

	const submit = async () => {
		setSubmitButtonClicked(true);
		const requiredInputFieldTypes = {
			placeId: 'string',
			categories: 'array',
			// imgUrl: 'array', you have to check any true img blob
			content: 'string',
		};

		const extraRequiredInputFieldTypesForEvents = {
			date: 'string', //TODO: check format
			eventName: 'string',
		};

		const areRequiredFieldsFilled = Object.keys(requiredInputFieldTypes).map(
			(key) => {
				if (requiredInputFieldTypes[key] === 'string') {
					return spotInput[key] ? true : false;
				}

				if (requiredInputFieldTypes[key] === 'array') {
					return spotInput[key].length > 0 ? true : false;
				}
			}
		);

		if (!areRequiredFieldsFilled.includes(false)) {
			console.log('yes they are filled!', areRequiredFieldsFilled);
		} else {
			console.log('nope they are not!', areRequiredFieldsFilled);
			if (!spotInput.placeId) {
				setSnackMessage({
					text: 'Not all required inputs are filled 😏',
					code: 'Error',
				});
				return;
			}
			return;
		}

		// check inputs that are not filled, and set submitButtonClicked to true
		// textfield error prop will then check against spotInput

		const uploadedImagesIds = await getPublicIdsOfUploadedImages(
			uploadedImgFiles,
			uploadedImageBlobToFile,
			`${guide.id}/${spotInput.placeId}`
		);

		if ([...spotInput.imgUrl, ...uploadedImagesIds].length < 1) {
			console.log('no imgs');
			return;
		}

		savePlace();
		saveSpot({
			variables: {
				...spotInput,
				guide: guide.id,
				place: spotInput.placeId,
				imgUrl: [...spotInput.imgUrl, ...uploadedImagesIds],
			},
		});
	};

	const errorMsgForUploadedImg = (uploadedImgPreviewCard) => {
		if (submitButtonClicked) {
			if (uploadedImgPreviewCard.length < 1) {
				return <p>you need pics</p>;
			}
			if (
				uploadedImgPreviewCard.length > 0 &&
				uploadedImgPreviewCard.every((el) => el === null)
			) {
				return <p>you need pics</p>;
			}
		}

		if (uploadedImgPreviewCard.length > 0) {
			return uploadedImgPreviewCard;
		}

		return <p>nothing is wrong</p>;
	};

	return (
		<div className={classes.root}>
			<PlaceAutoComplete
				clickFunction={getDetailsFromAutoCompleteItem}
				city={spotInput.guide.city}
				coordinates={guide.coordinates}
			/>
			<TextField
				className={classes.textField}
				label="Categories"
				name="categories"
				value={spotInput.categories}
				variant="outlined"
				select
				SelectProps={{ multiple: true }}
				onChange={spotFieldChangeHandler}
				error={submitButtonClicked && spotInput.categories.length < 1}
			>
				{categoryMenu(guide)}
			</TextField>
			<TextField
				className={classes.textField}
				id="edit-placeId"
				label="PlaceId"
				value={spotInput.placeId}
				variant="outlined"
				disabled
				error={submitButtonClicked && !spotInput.placeId}
			/>
			<TextField
				className={classes.textField}
				id="edit-name"
				label="Name"
				value={spotInput.name}
				variant="outlined"
				disabled
			/>
			{spotInput.categories[0] === 'Event' && (
				<>
					<TextField
						className={classes.textField}
						label="EventName"
						name="eventName"
						value={spotInput.eventName}
						variant="outlined"
						onChange={spotFieldChangeHandler}
					/>
					<TextField
						className={classes.textField}
						label="Date"
						name="date"
						value={spotInput.date}
						variant="outlined"
						onChange={spotFieldChangeHandler}
					/>
				</>
			)}
			<TextField
				className={classes.textField}
				label="Rating"
				value={spotInput.rating}
				variant="outlined"
				disabled
			/>
			<TextField
				className={classes.textField}
				label="Address"
				value={spotInput.address}
				variant="outlined"
				disabled
			/>
			<TextField
				className={classes.textField}
				label="Location"
				value={spotInput.location}
				variant="outlined"
				disabled
			/>
			<p>Hours:</p>
			{spotInput.hours && <p>{spotInput.hours.join(' | ')}</p>}
			<div className={classes.textField}>
				<div className={classes.mediaCards}>
					{spotInput.imgUrl.map((img) => {
						return (
							<LoggingImageExisting
								img={img}
								deleteHandler={deleteExistingImageHandler}
							/>
						);
					})}
				</div>

				<div className={classes.mediaCards}>
					{errorMsgForUploadedImg(uploadedImgPreviewCard)}
				</div>
			</div>
			<div className={classes.textField}>
				<input
					className={classes.mediaCards}
					data-testid="file-input"
					accept="image/*"
					multiple
					type="file"
					onChange={fileUploadClicked}
				/>
			</div>
			<div dangerouslySetInnerHTML={{ __html: marked(spotInput.content) }} />
			<TextField
				className={classes.textField}
				id="edit-content"
				label="Content"
				name="content"
				value={spotInput.content}
				variant="outlined"
				multiline
				rows={4}
				onChange={spotFieldChangeHandler}
				error={submitButtonClicked && !spotInput.content}
			/>
			<Button
				variant="outlined"
				id="submit"
				className={classes.submitButton}
				onClick={submit}
			>
				Submit
			</Button>
		</div>
	);
};

const SAVE_PLACE = gql`
	mutation savePlace(
		$id: String!
		$name: String!
		$rating: Float!
		$address: String!
		$location: [Float]!
		$hours: [String]
	) {
		savePlace(
			placeInput: {
				id: $id
				name: $name
				rating: $rating
				address: $address
				location: $location
				hours: $hours
			}
		) {
			name
		}
	}
`;

const SAVE_SPOT = gql`
	mutation saveSpot(
		$guide: String!
		$place: String!
		$categories: [String]!
		$imgUrl: [String]!
		$content: String!
		$eventName: String
		$date: String
	) {
		saveSpot(
			spotInput: {
				guide: $guide
				place: $place
				categories: $categories
				imgUrl: $imgUrl
				content: $content
				eventName: $eventName
				date: $date
			}
		) {
			guide
		}
	}
`;
