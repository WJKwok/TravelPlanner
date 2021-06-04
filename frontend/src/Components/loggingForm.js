import React, {
	useContext,
	useState,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import { LoggerContext, emptyClickedCardState } from '../Store/LoggerContext';
import { SnackBarContext } from '../Store/SnackBarContext';
import { SpotContext } from '../Store/SpotContext';
import { SPOT_DATA } from '../utils/graphql';

import { LoggingImage } from './images';
import PlaceAutoComplete from './placeAutoComplete';
import { CategoryDragAndDrop } from './categoryDragAndDrop';
import { SpotCardBase } from './spotCardBaseWeb';
import { SpotCardContent } from './spotCardContent';

import { TextField, Button, Typography, Card } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import { useMutation, gql } from '@apollo/client';
import { getPublicIdsOfUploadedImages } from '../Services/cloudinaryApi';

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: 50,
		width: '100%',
		maxWidth: 1280,
		margin: 'auto',
		padding: '0px 16px',
		[theme.breakpoints.down(430)]: {
			padding: 0,
		},
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
	previewCardAndSubmitDiv: {
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
	},
	previewText: {
		textAlign: 'center',
		backgroundColor: 'lightgray',
		margin: '0px 5px',
		borderRadius: 3,
	},
	cardContentDiv: {
		width: theme.cardWidth,
		margin: 5,
		height: 500,
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	submitButton: {
		float: 'right',
		margin: 5,
	},
}));

export const LoggingForm = ({ guide }) => {
	const classes = useStyles();
	const { clickedCard, setClickedCard } = useContext(LoggerContext);
	const { setSnackMessage } = useContext(SnackBarContext);
	const { dispatch } = useContext(SpotContext);

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
				reviews: clickedCard.place.reviews,
				imgUrl: clickedCard.imgUrl,
				content: clickedCard.content,
				website: clickedCard.place.website,
				internationalPhoneNumber: clickedCard.place.internationalPhoneNumber,
			});
			clearingImgUploads();
		}
	}, [clickedCard]);

	// somehow it is impt to put the values here if not your textfield label will not shrink even with value
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
		hours: [],
		imgUrl: [],
		content: '',
		website: '',
		internationalPhoneNumber: '',
	};

	const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
	const [uploadedImgFiles, setUploadedImgFiles] = useState({});
	const [uploadedImageBlobToFile, setUploadedImageBlobToFile] = useState({});
	const inputRef = useRef(null);
	const [spotInput, setSpotInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialSpotState
	);

	console.log('user ratings total', spotInput);

	const clearingImgUploads = () => {
		inputRef.current.value = null;
		setUploadedImgFiles({});
		setUploadedImageBlobToFile({});
	};
	const spotFieldChangeHandler = (e) => {
		const name = e.target.name;
		const newValue = e.target.value;
		setSpotInput({ [name]: newValue });
	};

	const getDetailsFromAutoCompleteItem = (placeObject) => {
		console.log('placeObject', placeObject);
		setSpotInput({
			...initialSpotState,
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

	const uploadedImgPreviewCard = Object.keys(uploadedImageBlobToFile)
		.filter((imgLink) => uploadedImageBlobToFile[imgLink].toUpload)
		.map((imgLink) => {
			console.log('uploaded????', imgLink);
			const imgPreview = (
				<LoggingImage
					testId="uploadedImage"
					img={imgLink}
					deleteHandler={deleteUploadedImageHandler}
				/>
			);
			return imgPreview;
		});

	const [saveSpot] = useMutation(SAVE_SPOT, {
		onCompleted({ saveSpot }) {
			console.log('saved spot', saveSpot);
			dispatch({
				type: 'ADD_SPOTS',
				payload: {
					newSpots: [saveSpot],
					spotToHighlightID: saveSpot.id,
				},
			});
			setSnackMessage({
				text: 'Spot Saved!',
				code: 'Confirm',
			});
			clearingImgUploads();
			setSpotInput(initialSpotState);
			setSubmitButtonClicked(false);
			setClickedCard(emptyClickedCardState);
		},
		update(proxy, result) {
			try {
				const data = proxy.readQuery({
					query: GET_ALL_SPOTS_IN_GUIDE,
					variables: {
						guideId: guide.id,
					},
				});

				console.log('saveSpot result:', result, data);
				if (
					data.getAllSpotsForGuide.spots.filter(
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
							getAllSpotsForGuide: {
								...data.getAllSpotsForGuide,
								spots: [
									...data.getAllSpotsForGuide.spots,
									result.data.saveSpot,
								],
							},
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
		if (uploadedImgPreviewCard.length > 0) {
			return uploadedImgPreviewCard;
		}

		if (submitButtonClicked) {
			if (spotInput.imgUrl.length > 0) {
				return;
			}

			if (uploadedImgPreviewCard.length === 0) {
				return <Typography color="error">Photos are required</Typography>;
			}
		}

		return;
	};

	return (
		<div className={classes.root}>
			<PlaceAutoComplete
				clickFunction={getDetailsFromAutoCompleteItem}
				city={guide.city}
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
				label="Phone number"
				value={spotInput.internationalPhoneNumber}
				variant="outlined"
				disabled
			/>
			<TextField
				className={classes.textField}
				label="Website"
				value={spotInput.website}
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
			<TextField
				className={classes.textField}
				label="Hours"
				value={spotInput.hours && spotInput.hours.join(' | ')}
				variant="outlined"
				disabled
			/>
			<div className={classes.textField}>
				<div className={classes.mediaCards}>
					{spotInput.imgUrl.map((img) => {
						return (
							<LoggingImage
								img={img}
								deleteHandler={deleteExistingImageHandler}
								testId="edit-existing-image"
							/>
						);
					})}
				</div>

				<div className={classes.mediaCards}>
					{errorMsgForUploadedImg(uploadedImgPreviewCard)}
				</div>
				<input
					className={classes.mediaCards}
					data-testid="file-input"
					accept="image/*"
					multiple
					type="file"
					ref={inputRef}
					onChange={fileUploadClicked}
				/>
			</div>
			<TextField
				className={classes.textField}
				id="edit-content"
				label="Content"
				name="content"
				value={spotInput.content}
				variant="outlined"
				multiline
				rows={8}
				onChange={spotFieldChangeHandler}
				error={submitButtonClicked && !spotInput.content}
			/>
			<div className={classes.previewCardAndSubmitDiv}>
				<div>
					<Typography className={classes.previewText}>Preview</Typography>
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
								...Object.keys(uploadedImageBlobToFile)
									.filter(
										(imgLink) => uploadedImageBlobToFile[imgLink].toUpload
									)
									.map((imgLink) => imgLink),
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
								internationalPhoneNumber: spotInput.internationalPhoneNumber,
								website: spotInput.website,
							},
						}}
						index={0}
						day={1}
						expanded={true}
						isEditMode={true}
					/>
					<Card className={classes.cardContentDiv}>
						<SpotCardContent
							dummySpot={{
								categories: spotInput.categories,
								content: spotInput.content,
								date: '',
								eventName: '',
								guide: '',
								id: '',
								imgUrl: [
									...spotInput.imgUrl,
									...Object.keys(uploadedImageBlobToFile)
										.filter(
											(imgLink) => uploadedImageBlobToFile[imgLink].toUpload
										)
										.map((imgLink) => imgLink),
								],
								place: {
									address: spotInput.address,
									businessStatus: spotInput.businessStatus,
									hours: spotInput.hours,
									reviews: spotInput.reviews,
									id: '',
									location: spotInput.location,
									name: spotInput.name,
									rating: spotInput.rating,
									userRatingsTotal: spotInput.userRatingsTotal,
									internationalPhoneNumber: spotInput.internationalPhoneNumber,
									website: spotInput.website,
								},
							}}
						/>
					</Card>
				</div>
				<Button
					variant="outlined"
					id="submit"
					className={classes.submitButton}
					onClick={submit}
				>
					Submit
				</Button>
			</div>
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
		$businessStatus: String
		$hours: [String]
		$internationalPhoneNumber: String
		$website: String
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
				businessStatus: $businessStatus
				internationalPhoneNumber: $internationalPhoneNumber
				website: $website
			}
		) {
			...SpotData
		}
	}
	${SPOT_DATA}
`;

const GET_ALL_SPOTS_IN_GUIDE = gql`
	query getAllSpotsForGuide($guideId: ID!) {
		getAllSpotsForGuide(guideId: $guideId) {
			guide {
				id
				name
				city
				coordinates
				categories
				plannerImage
			}
			spots {
				...SpotData
			}
		}
	}
	${SPOT_DATA}
`;
