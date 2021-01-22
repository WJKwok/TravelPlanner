import React, { useState, useContext, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	TextField,
	MenuItem,
	Button,
	IconButton,
	Select,
} from '@material-ui/core/';
import PlaceAutoComplete from '../Components/placeAutoComplete';
import AppBar from '../Components/appBar';
import SpotsBoard from '../Components/spotsBoard';
import { DragDropContext } from 'react-beautiful-dnd';

import { SnackBarContext } from '../Store/SnackBarContext';
import { LoggerContext } from '../Store/LoggerContext';

import CategoryChipBar, {
	currentlySelectedChips,
} from '../Components/categoryChipBar/';
import { iconDict } from '../Components/spotIcons';
import DeleteIcon from '@material-ui/icons/Delete';

import { Image } from 'cloudinary-react';

import { useQuery, useMutation, gql } from '@apollo/client';

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

function Logger(props) {
	const classes = useStyles();

	const guideId = props.match.params.guideBookId;
	const { setSnackMessage } = useContext(SnackBarContext);

	const { clickedCard } = useContext(LoggerContext);

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
		imgUrl: [],
		content: '',
	};

	const [spotInput, setSpotInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialSpotState
	);

	const spotFieldChangeHandler = (e) => {
		const name = e.target.name;
		const newValue = e.target.value;
		setSpotInput({ [name]: newValue });
	};

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
				imgUrl: clickedCard.imgUrl,
				content: clickedCard.content,
			});
		}
	}, [clickedCard]);

	const [uploadedImgFiles, setUploadedImgFiles] = useState({});
	const [uploadedImageBlobToFile, setUploadedImageBlobToFile] = useState({});
	const [mapCoordinates, setMapCoordinates] = useState([]);
	const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

	const { data: { getAllSpotsForGuide: allSpots } = [] } = useQuery(
		GET_ALL_SPOTS_IN_GUIDE,
		{
			variables: {
				guideId,
			},
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

	const getDetails = (placeObject) => {
		console.log(placeObject);
		setSpotInput({
			...placeObject,
			placeId: placeObject.id,
			location: [placeObject.location.lat, placeObject.location.lng],
		});
	};
	console.log('spotInput', spotInput);

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

		const uploadedImagesIds = await uploadedImagesPublicIds(uploadedImgFiles);

		if ([...spotInput.imgUrl, ...uploadedImagesIds].length < 1) {
			console.log('no imgs');
			return;
		}

		savePlace();
		saveSpot({
			variables: {
				...spotInput,
				guide: spotInput.guide.id,
				place: spotInput.placeId,
				imgUrl: [...spotInput.imgUrl, ...uploadedImagesIds],
			},
		});
	};

	const [categoryChips, setCategoryChips] = useState([]);

	useQuery(GET_GUIDE, {
		onCompleted({ getGuide }) {
			console.log('guide: ', getGuide);
			getCategories(getGuide.categories, getGuide.categories);
			setSpotInput({ guide: getGuide });
			setMapCoordinates([...getGuide.coordinates]);
		},
		variables: {
			guideId,
		},
	});

	const getCategories = (guideCategories, clickedCategories = []) => {
		let categories = guideCategories.map((category) => {
			return {
				key: category,
				label: category,
				icon: iconDict[category],
				clicked: clickedCategories.includes(category) ? true : false,
			};
		});

		console.log('building chips... :', categories);
		setCategoryChips(categories);
	};

	const toggleChipHandler = (clickedChip) => {
		const chipsClone = [...categoryChips];
		const objectIndex = categoryChips.findIndex(
			(chip) => chip.key === clickedChip.key
		);
		chipsClone[objectIndex].clicked = !categoryChips[objectIndex].clicked;
		setCategoryChips(chipsClone);
	};

	const renderSpotsBoard = () => {
		const unfilteredSpots = allSpots;
		console.log('allSpots', allSpots);

		const selectedCategories = currentlySelectedChips(categoryChips);
		const filteredSpots = unfilteredSpots.filter((spot) =>
			spot.categories.some((cat) => selectedCategories.includes(cat))
		);

		return (
			<SpotsBoard
				dragAndDroppable={false}
				key={guideId}
				boardId={guideId}
				spots={filteredSpots}
				coordinates={mapCoordinates}
			/>
		);
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

	const uploadedImagesPublicIds = async (uploadedImgFiles) => {
		if (!uploadedImgFiles.length) {
			return [];
		}

		const indexesToUpload = [];
		Object.keys(uploadedImageBlobToFile).forEach((img) => {
			if (uploadedImageBlobToFile[img].toUpload == true) {
				indexesToUpload.push(uploadedImageBlobToFile[img].index);
			}
		});

		const promises = [...uploadedImgFiles].reduce(
			(result, imageFile, index) => {
				if (indexesToUpload.includes(index)) {
					const formData = new FormData();
					formData.append('file', imageFile);
					formData.append('upload_preset', 'mtmsf9hg');
					formData.append('folder', `${guideId}/${spotInput.placeId}`);

					result.push(
						fetch(
							`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
							{
								method: 'POST',
								body: formData,
							}
						)
							.then((response) => response.json())
							.then((data) => data.public_id)
							.catch((err) => console.error(err))
					);
				}
				return result;
			},
			[]
		);

		return await Promise.all(promises);
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

	const onDragEnd = (result) => {
		return;
	};

	const uploadedImgPreviewCard = Object.keys(uploadedImageBlobToFile).map(
		(imgLink) => {
			const imgPreview = uploadedImageBlobToFile[imgLink].toUpload ? (
				<div
					key={imgLink}
					data-testid="uploadedImage"
					className={classes.mediaCard}
				>
					<img src={imgLink} className={classes.media} />
					<IconButton
						className={classes.deleteButton}
						onClick={() => deleteUploadedImageHandler(imgLink)}
					>
						<DeleteIcon color="error" />
					</IconButton>
				</div>
			) : null;
			return imgPreview;
		}
	);

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

	console.log('uploadedImgPreviewCard', uploadedImgPreviewCard);

	return (
		<>
			<AppBar offset={true} />
			<DragDropContext onDragEnd={onDragEnd}>
				<CategoryChipBar
					categoryChips={categoryChips}
					toggleChipHandler={toggleChipHandler}
				/>
				{allSpots && renderSpotsBoard()}
			</DragDropContext>
			<div className={classes.root}>
				<PlaceAutoComplete
					clickFunction={getDetails}
					city={spotInput.guide.city}
					coordinates={spotInput.guide.coordinates}
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
					{categoryMenu(spotInput.guide)}
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
							const image =
								img.substring(0, 4) === 'http' ? (
									<img className={classes.media} src={img} />
								) : (
									<Image
										className={classes.media}
										cloudName={process.env.REACT_APP_CLOUD_NAME}
										publicId={img}
									/>
								);
							const imageCard = (
								<div
									data-testid="edit-existing-image"
									key={img}
									className={classes.mediaCard}
								>
									{image}
									<IconButton
										className={classes.deleteButton}
										data-testid="delete-image"
										onClick={() => deleteExistingImageHandler(img)}
									>
										<DeleteIcon color="error" />
									</IconButton>
								</div>
							);
							return imageCard;
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
		</>
	);
}

/* 
if you type def is savePlace(placeInput: PlaceInput!): Place! <-- with an '!' after PlaceInput, you can't use this:

const SAVE_PLACE = gql`
    mutation savePlace(
        $placeInput: PlaceInput
    ){
        savePlace(
            placeInput: $placeInput
        ){
            name
        }
    }
`

With the '!' the playground will still work, but here it wont.
You have to use the below:
*/

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

const GET_GUIDE = gql`
	query getGuide($guideId: ID!) {
		getGuide(guideId: $guideId) {
			id
			name
			city
			coordinates
			categories
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

export default Logger;
