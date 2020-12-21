import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem, Button } from '@material-ui/core/';
import PlaceAutoComplete from '../Components/placeAutoComplete';
import AppBar from '../Components/appBar';
import SpotsBoard from '../Components/spotsBoard';
import { DragDropContext } from 'react-beautiful-dnd';

import { LoggerContext } from '../Store/LoggerContext';

import CategoryChip from '../Components/categoryChip';
import { iconDict } from '../Components/spotIcons';
import Paper from '@material-ui/core/Paper';
import { Image } from 'cloudinary-react';

import { useQuery, useMutation, gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		paddingTop: 15,
	},
	autoComplete: {
		flex: 2,
	},
	form: {
		flex: 3,
		marginLeft: 8,
	},
	textField: {
		marginBottom: 8,
		width: '100%',
	},
	mediaCards: {
		paddingBottom: 10,
		display: 'flex',
		overflowX: 'auto',
		overflowX: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	media: {
		width: '90%',
		height: 300,
		objectFit: 'cover',
		marginRight: 3,
	},
	submitButton: {
		float: 'right',
	},
	categoryChipBoard: {
		display: 'flex',
		overflowX: 'auto',
		listStyle: 'none',
		padding: theme.spacing(0.5),
		alignItems: 'flex-start',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		backgroundColor: 'rgba(255,255,255)',
	},
}));

function Logger(props) {
	const classes = useStyles();

	const guideId = props.match.params.guideBookId;

	const { clickedCard } = useContext(LoggerContext);

	useEffect(() => {
		if (Object.keys(clickedCard).length > 0) {
			setCategory(clickedCard.category);
			setPlaceId(clickedCard.place.id);
			setName(clickedCard.place.name);
			setRating(clickedCard.place.rating);
			setAddress(clickedCard.place.address);
			setLocation(clickedCard.place.location);
			setImgUrl(clickedCard.imgUrl);
			setContent(clickedCard.content);
		}
	}, [clickedCard]);

	const [city, setCity] = useState('Berlin');
	const [guide, setGuide] = useState({});
	const [category, setCategory] = useState('');
	const [placeId, setPlaceId] = useState('');
	const [name, setName] = useState('');
	const [date, setDate] = useState('');
	const [eventName, setEventName] = useState('');
	const [rating, setRating] = useState('');
	const [address, setAddress] = useState('');
	const [location, setLocation] = useState([]);
	const [imgUrl, setImgUrl] = useState([]);
	const [content, setContent] = useState('');

	const { data } = useQuery(GET_GUIDES, {
		onCompleted(data) {
			console.log(data);
		},
	});

	const { data: { getAllSpotsForGuide: allSpots } = [] } = useQuery(
		GET_ALL_SPOTS_IN_GUIDE,
		{
			onCompleted({ getAllSpotsForGuide }) {
				// console.log(getAllSpotsForGuide);
			},
			variables: {
				guideId,
			},
		}
	);

	if (allSpots) {
		console.log('getAllSpotsForGuide', allSpots);
	}

	const [savePlace] = useMutation(SAVE_PLACE, {
		update(_, result) {
			console.log(result);
		},
		variables: {
			id: placeId,
			name,
			rating,
			address,
			location,
		},
	});

	const [saveSpot] = useMutation(SAVE_SPOT, {
		update(_, result) {
			console.log(result);
		},
		onError({ graphQLErrors, networkError }) {
			console.log(graphQLErrors);
			console.log(networkError);
		},
		variables: {
			guide: guide.id,
			place: placeId,
			category,
			imgUrl,
			content,
			date,
			eventName,
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
		setPlaceId(placeObject.id);
		setName(placeObject.name);
		setRating(placeObject.rating);
		setAddress(placeObject.address);
		setLocation([placeObject.location.lat, placeObject.location.lng]);
	};

	const submit = () => {
		savePlace();
		saveSpot();
		setCategory('');
		setPlaceId('');
		setName('');
		setRating('');
		setAddress('');
		setLocation('');
		setImgUrl('');
		setContent('');
	};

	const onDragEnd = (result) => {
		return;
	};

	const [categoryChips, setCategoryChips] = useState([]);

	useQuery(GET_GUIDE, {
		onCompleted({ getGuide }) {
			console.log('guide: ', getGuide);
			getCategories(getGuide.categories, getGuide.categories);
			setGuide(getGuide);
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

	const toggleChip = (clickedChip) => {
		const chipsClone = [...categoryChips];
		const objectIndex = categoryChips.findIndex(
			(chip) => chip.key === clickedChip.key
		);
		chipsClone[objectIndex].clicked = !categoryChips[objectIndex].clicked;
		setCategoryChips(chipsClone);
	};

	const currentlySelectedChips = () => {
		let selectedChips = [];
		for (var i = 0; i < categoryChips.length; i++) {
			if (categoryChips[i].clicked) {
				selectedChips.push(categoryChips[i].label);
			}
		}
		return selectedChips;
	};

	const renderSpotsBoard = () => {
		const unfilteredSpots = allSpots;

		const selectedCategories = currentlySelectedChips();
		const filteredSpots = unfilteredSpots.filter((spot) =>
			selectedCategories.includes(spot.category)
		);

		return (
			<SpotsBoard
				dragAndDroppable={false}
				key={guideId}
				boardId={guideId}
				spots={filteredSpots}
				coordinates={[52.52, 13.4]}
			/>
		);
	};

	const fileUploadClicked = async (event) => {
		console.log('upload files', event.target.files);

		// let file = event.target.files[0];
		// const url = URL.createObjectURL(event.target.files[0]);
		// console.log('url??', url);

		// const formData = new FormData();
		// formData.append('file', event.target.files[0]);
		// formData.append('upload_preset', 'mtmsf9hg');
		// formData.append('folder', `${guideId}/${placeId}`);

		// const uploadedFiles = event.target.files;
		const promises = [...event.target.files].map((imageFile) => {
			const formData = new FormData();
			formData.append('file', imageFile);
			formData.append('upload_preset', 'mtmsf9hg');
			formData.append('folder', `${guideId}/${placeId}`);

			return fetch(
				`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
				{
					method: 'POST',
					body: formData,
				}
			)
				.then((response) => response.json())
				.then((data) => data)
				.catch((err) => console.error(err));
		});

		let allData = await Promise.all(promises);

		console.log('final data:', allData);
		// fetch(
		// 	`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
		// 	{
		// 		method: 'POST',
		// 		body: formData,
		// 	}
		// )
		// 	.then((response) => response.json())
		// 	.then((data) =>  data)
		// 	.catch((err) => console.error(err));
	};
	return (
		<>
			<AppBar offset={true} />
			<DragDropContext onDragEnd={onDragEnd}>
				<Paper
					component="ul"
					className={classes.categoryChipBoard}
					variant="outlined"
				>
					{categoryChips.map((data) => {
						return (
							<li key={data.key}>
								<CategoryChip data={data} toggleChip={toggleChip} />
							</li>
						);
					})}
				</Paper>
				{allSpots && renderSpotsBoard()}
			</DragDropContext>
			<div className={classes.root}>
				<div className={classes.autoComplete}>
					<PlaceAutoComplete clickFunction={getDetails} city={city} />
					<input
						accept="image/*"
						multiple
						type="file"
						onChange={fileUploadClicked}
					/>
				</div>

				<div className={classes.form}>
					<TextField
						className={classes.textField}
						label="Category"
						value={category}
						variant="outlined"
						select
						onChange={(e) => {
							setCategory(e.target.value);
						}}
					>
						{categoryMenu(guide)}
					</TextField>
					<TextField
						className={classes.textField}
						label="PlaceId"
						value={placeId}
						variant="outlined"
						disabled
					/>
					<TextField
						className={classes.textField}
						label="Name"
						value={name}
						variant="outlined"
						disabled
					/>
					{category === 'Event' && (
						<>
							<TextField
								className={classes.textField}
								label="EventName"
								value={eventName}
								variant="outlined"
								onChange={(e) => setEventName(e.target.value)}
							/>
							<TextField
								className={classes.textField}
								label="Date"
								value={date}
								variant="outlined"
								onChange={(e) => setDate(e.target.value)}
							/>
						</>
					)}
					<TextField
						className={classes.textField}
						label="Rating"
						value={rating}
						variant="outlined"
						disabled
					/>
					<TextField
						className={classes.textField}
						label="Address"
						value={address}
						variant="outlined"
						disabled
					/>
					<TextField
						className={classes.textField}
						label="Location"
						value={location}
						variant="outlined"
						disabled
					/>
					<TextField
						className={classes.textField}
						label="ImgUrl"
						value={imgUrl}
						variant="outlined"
						onChange={(e) => setImgUrl(e.target.value)}
					/>
					<div className={classes.mediaCards}>
						{imgUrl.map((imgLink) => (
							<img src={imgLink} className={classes.media} />
						))}
					</div>
					<TextField
						className={classes.textField}
						label="Content "
						value={content}
						variant="outlined"
						multiline
						rows={4}
						onChange={(e) => setContent(e.target.value)}
					/>
					<Button
						variant="outlined"
						className={classes.submitButton}
						onClick={submit}
					>
						Submit
					</Button>
				</div>
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
	) {
		savePlace(
			placeInput: {
				id: $id
				name: $name
				rating: $rating
				address: $address
				location: $location
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
		$category: String!
		$imgUrl: String!
		$content: String!
		$eventName: String
		$date: String
	) {
		saveSpot(
			spotInput: {
				guide: $guide
				place: $place
				category: $category
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

const GET_GUIDES = gql`
	query getGuides {
		getGuides {
			id
			name
			city
			categories
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
			category
			imgUrl
			content
			eventName
			date
		}
	}
`;

export default Logger;
