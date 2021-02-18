import React, { useContext, useState, useEffect, useReducer } from 'react';
import { LoggerContext, emptyClickedCardState } from '../Store/LoggerContext';
import { SnackBarContext } from '../Store/SnackBarContext';

import { LoggingImageUploaded, LoggingImageExisting } from './loggingImage';
import PlaceAutoComplete from './placeAutoComplete';
import { CategoryDragAndDrop } from './categoryDragAndDrop';
import { SpotCardBase } from './spotCardBase';

import { TextField, Button } from '@material-ui/core/';
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
	const { clickedCard, setClickedCard } = useContext(LoggerContext);
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
				userRatingsTotal: clickedCard.place.userRatingsTotal,
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

	console.log('user ratings total', spotInput);

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

	// const [savePlace] = useMutation(SAVE_PLACE, {
	// 	update(_, result) {
	// 		console.log(result);
	// 	},
	// 	onError(err) {
	// 		console.log('err', err);
	// 	},
	// 	variables: {
	// 		...spotInput,
	// 		id: spotInput.placeId,
	// 		// name: spotInput.name,
	// 		// rating: spotInput.rating,
	// 		// address: spotInput.address,
	// 		// location: spotInput.location,
	// 	},
	// });

	const [saveSpot] = useMutation(SAVE_SPOT, {
		onCompleted({ saveSpot }) {
			console.log('saved spot', saveSpot);
			setSnackMessage({
				text: 'Spot Saved!',
				code: 'Confirm',
			});
			setSpotInput(initialSpotState);
			setUploadedImgFiles({});
			setUploadedImageBlobToFile({});
			setSubmitButtonClicked(false);
			setClickedCard(emptyClickedCardState);
		},
		update(proxy, result) {
			console.log('saveSpot result:', result);

			try {
				const data = proxy.readQuery({
					query: GET_ALL_SPOTS_IN_GUIDE,
					variables: {
						guideId: guide.id,
					},
				});

				if (
					data.getAllSpotsForGuide.filter(
						(spot) => spot.id === result.data.saveSpot.id
					).length === 0
				) {
					console.log('updating new spot into cache...');
					proxy.writeQuery({
						query: GET_ALL_SPOTS_IN_GUIDE,
						variables: {
							guideId: guide.id,
						},
						data: {
							getAllSpotsForGuide: [
								...data.getAllSpotsForGuide,
								result.data.saveSpot,
							],
						},
					});
				} else {
					console.log(
						'spot already exists, no need to write to cache, apollo self updates'
					);
				}
			} catch (err) {
				console.log('update cache error:', err);
			}
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

		// savePlace();
		saveSpot({
			variables: {
				...spotInput,
				id: spotInput.placeId, // from save place
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
			<CategoryDragAndDrop
				guideCategories={guide.categories}
				orderedCategories={clickedCard.categories}
				onOrderChange={spotFieldChangeHandler}
			/>
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
			<SpotCardBase
				spot={{
					categories: spotInput.categories,
					content: spotInput.content,
					date: '',
					eventName: '',
					guide: '',
					id: '',
					imgUrl: [
						...spotInput.imgUrl,
						...Object.keys(uploadedImageBlobToFile).map((imgLink) => {
							if (uploadedImageBlobToFile[imgLink].toUpload) {
								return imgLink;
							}
						}),
					],
					place: {
						address: spotInput.address,
						businessStatus: spotInput.businessStatus,
						hours: spotInput.hours,
						id: '',
						location: spotInput.location,
						name: spotInput.name,
						rating: spotInput.rating,
						userRatingsTotal: spotInput.userRatingsTotal,
					},
				}}
				index={1}
				day={1}
				dragAndDroppable={false}
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

const SAVE_SPOT = gql`
	mutation saveSpot(
		$guide: String!
		$place: String!
		$categories: [String]!
		$imgUrl: [String]!
		$content: String!
		$eventName: String
		$date: String
		$id: String!
		$name: String!
		$rating: Float!
		$userRatingsTotal: Int!
		$address: String!
		$location: [Float]!
		$hours: [String]
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
			placeInput: {
				id: $id
				name: $name
				rating: $rating
				userRatingsTotal: $userRatingsTotal
				address: $address
				location: $location
				hours: $hours
			}
		) {
			id
			guide
			place {
				id
				name
				rating
				userRatingsTotal
				location
				businessStatus
				address
				hours
			}
			categories
			imgUrl
			content
			eventName
			date
		}
	}
`;

const GET_ALL_SPOTS_IN_GUIDE = gql`
	query getAllSpotsForGuide($guideId: ID!) {
		getAllSpotsForGuide(guideId: $guideId) {
			id
			guide
			place {
				id
				name
				rating
				userRatingsTotal
				location
				businessStatus
				address
				hours
			}
			categories
			imgUrl
			content
			eventName
			date
		}
	}
`;

// const SAVE_PLACE = gql`
// 	mutation savePlace(
// 		$id: String!
// 		$name: String!
// 		$rating: Float!
// 		$userRatingsTotal: Int!
// 		$address: String!
// 		$location: [Float]!
// 		$hours: [String]
// 	) {
// 		savePlace(
// 			placeInput: {
// 				id: $id
// 				name: $name
// 				rating: $rating
// 				userRatingsTotal: $userRatingsTotal
// 				address: $address
// 				location: $location
// 				hours: $hours
// 			}
// 		) {
// 			name
// 		}
// 	}
// `;
