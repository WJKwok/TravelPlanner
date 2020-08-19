import React, {useContext, useEffect, useState} from 'react'
import { useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {DragDropContext} from 'react-beautiful-dnd'
import moment from 'moment';

import CategoryChip from '../Components/categoryChip';
import SpotsBoard from '../Components/spotsBoard';
import DayBoard from '../Components/dayBoardCopy';
import DatePicker from '../Components/datePicker';
import PlaceAutoComplete from '../Components/placeAutoComplete';
import { SpotContext } from '../Store/SpotContext';
import { AuthContext } from '../Store/AuthContext'

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
// import BookIcon from "@material-ui/icons/Book";
// import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
// import StorefrontIcon from "@material-ui/icons/Storefront";

import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  categoryChipBoard: {
    display: "flex",
    overflowX: "auto",
    listStyle: "none",
    padding: theme.spacing(0.5),
    alignItems: "flex-start",
  },
  dayBoardContainer: {
    display: 'flex',
    borderRadius: 5,
    padding: '10px 0 20px 4px',
    overflowX: 'auto',
  },
  explanation: {
    backgroundColor: 'grey',
    color: 'white',
    padding: 5,
    marginBottom: 10,
  },
  dateAndSave: {
    display: 'flex',
  },
  saveButton: {
    margin: '0 0 0 auto',
    alignSelf: 'center',
  }
}));

function Planner(props) {

  const { authState } = useContext(AuthContext);
  const {spotState, dispatch} = useContext(SpotContext)

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [categoryChips, setCategoryChips] = useState([]);
  const [queriedVariables, setQueriedVariables] = useState([])
  const [startedSearch, setStartedSearch] = useState(false)
  const [newSearchItem, setNewSearchItem] = useState({})
  const [tripId, setTripId] = useState(props.match.params.tripId)

  const iconDict = {
      Retail: <LocalMallIcon />,
      Cafe: <LocalCafeIcon />,
      Restaurant: <RestaurantIcon />,
      Museum: <AccountBalanceIcon />,
      Searched: <SearchIcon />
  }

  console.log('tripId :', tripId)
  console.log('user exists? ', authState.user)
  //temporary for testing
  const guideId = props.match.params.guideBookId;
  console.log(props.match.params);
  useEffect(() => {
    if (tripId === undefined){
      dispatch({type:"CLEAR_STATE"})
      // console.log('fetch trip')
      // getTrip({variables:{tripId}})
      // console.log('trip categories', spotState.categoriesInTrip)
    } 
  }, [])

  useEffect(() => {
    if (startedSearch) {
      const searchChip = {
        key: 'Searched',
        label: 'Searched',
        icon: iconDict['Searched'],
        clicked: true
      }
  
      const categoriesAndSearch = [searchChip, ...categoryChips]
      setCategoryChips(categoriesAndSearch)
    }
  }, [startedSearch])

  console.log('queriedVariables: ', queriedVariables);

  useQuery(GET_GUIDE, {
    skip: tripId,
    onCompleted({getGuide}){
      console.log('guide: ', getGuide)
      getCategories(getGuide.categories)
    },
    variables: {
      guideId,
    }
  })

  // const [getTrip] = 
  useQuery(GET_TRIP, {
    skip: tripId === undefined,
    onCompleted({getTrip : trip}){ 
      console.log("get trip: ", trip)
      // categories in trip are clicked
      setQueriedVariables(trip.categoriesInTrip)
      getCategories(trip.guide.categories, trip.categoriesInTrip)
      setStartedSearch(trip.googlePlacesInTrip.length > 0)
      dispatch({type:'LOAD_TRIP', payload:{trip}})
    },
    onError(err){
      console.log("GETTRIP error", err);
    },
    variables:{tripId}
  })

  const [getSpots] = useLazyQuery(GET_SPOTS, {
    onCompleted({getSpots}){  //deconstruct from data
      dispatch({type:'ADD_SPOTS', payload:{newSpots: getSpots}})
      if (getSpots.length > 0) {
          setQueriedVariables([...queriedVariables, getSpots[0].category])
      }
    },
  })

  const [getSpot] = useLazyQuery(GET_SPOT, {
    onCompleted({getSpot}){  //deconstruct from data
      if (!getSpot) {
        dispatch({ type:'ADD_SEARCH_ITEM', payload:{newSearchItem}})
        setStartedSearch(true)
        enqueueSnackbar("Spot has been added in 'Searched' :)", {variant: 'success'})
      } else {
        const itemCategory = getSpot.category;
        getSpots({variables: {
            guideId,
            category: itemCategory
        }})
        enqueueSnackbar(`item is in ${itemCategory} :)`, {variant: 'info'})
      }
    },
  })

  const getCategories = (guideCategories, clickedCategories=[]) => {
    let categories = guideCategories.map(category => {
        return {
            key: category,
            label: category,
            icon: iconDict[category],
            clicked: clickedCategories.includes(category) ? true : false
        }
    })
    console.log('building chips... :', categories)
    setCategoryChips(categories)
  }

  const toggleClick = clickedChip => {
    const chipsClone = [...categoryChips];
    const objectIndex = categoryChips.findIndex(
      chip => chip.key === clickedChip.key
    );
    chipsClone[objectIndex].clicked = !categoryChips[objectIndex].clicked;
    setCategoryChips(chipsClone);

    if (chipsClone[objectIndex].clicked && !queriedVariables.includes(clickedChip.label)) {
        getSpots({variables: {
            guideId,
            category: clickedChip.label
        }})
    } 
  };

  const currentlySelectedChips = () => {
    let selectedChips = []
    for (var i = 0; i < categoryChips.length; i ++){
      if (categoryChips[i].clicked){
        selectedChips.push(categoryChips[i].label)
      }
    }
    return selectedChips
  }

  const searchedItemClicked = (searchedItem) => {

    for (var key in spotState.spots) {
      if (spotState.spots[key].place.id === searchedItem.id) {
        console.log("STOP DO NOT ADD")
        enqueueSnackbar("Item already exists", { variant: "info" });
        return
      }
    }

    const reshapedItem = {
      category: 'Searched',
      content: "hello",
      guide: 'Searched',
      id: searchedItem.id,
      imgUrl: "https://i.imgur.com/zbBglmB.jpg",
      place: {
        id: searchedItem.id,
        location: [searchedItem.location.lat, searchedItem.location.lng],
        name: searchedItem.name,
        rating: searchedItem.rating,
        businessStatus: searchedItem.businessStatus,
        hours: searchedItem.hours
      }
    }

    setNewSearchItem(reshapedItem)

    getSpot({variables: {
      guideId,
      placeId: searchedItem.id
    }})
  }

  const [submitTrip] = useMutation(SUBMIT_TRIP, {
    onCompleted({submitTrip}){
      console.log(submitTrip);
      setTripId(submitTrip.id);
      enqueueSnackbar("Your trip has been saved:)", {variant: 'success'})
    },
    update(proxy, result){

      console.log('submitTrip result:', result);

      try {
        const data = proxy.readQuery({
            query: GET_USER_TRIPS,
            variables: {
                userId: authState.user.id
            }
        });

        // writing to cache so that the query doesn't have to recall
        // for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
        proxy.writeQuery({
            query: GET_USER_TRIPS,
            variables: {
                userId: authState.user.id
            },
            data: {
              getUserTrips: [...data.getUserTrips, result.data.submitTrip]
            }
        })
      } catch (err) {
        console.log('update cache error:', err);
      }
    },
    onError(err){
      console.log(err)
    }
  })

  const [editTrip] = useMutation(EDIT_TRIP, {
    onCompleted({editTrip}){
      console.log("Trip edited",editTrip);
      setTripId(editTrip.id);
      enqueueSnackbar("Your trip has been saved:)", {variant: 'success'})
    },
    update(proxy, result){
      try {

          const data = proxy.readQuery({
              query: GET_TRIP,
              variables: {
                  tripId
              }
          });

          // writing to cache so that the query doesn't have to recall
          // for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
          proxy.writeQuery({
              query: GET_TRIP,
              variables: {
                  tripId
              },
              data: {
                  getTrip: {
                    ...data.getTrip,
                    filteredSpots: spotState.columns['filtered-spots'].spotIds,
                    spotsArray: Object.values(spotState.spots),
                    categoriesInTrip: queriedVariables
                  }
              }
          })
      } catch (err) {
          console.log('update cache error:', err);
      }
        
    },
    onError(err){
      console.log(err)
    }
  })

  const saveItinerary = () => {
    const dayKeyArray = spotState.dayBoard;
    let categoriesInTrip = []
    let googlePlacesInTrip = []
    let daySpotsArray = []
    for (let i=0; i < dayKeyArray.length; i++) {
      daySpotsArray.push(spotState.columns[dayKeyArray[i]].spotIds)
    }

    const daySpotsArrayFlattened = daySpotsArray.flat()

    for (let j=0; j < daySpotsArrayFlattened.length; j++){
      const category = spotState.spots[daySpotsArrayFlattened[j]].category

      if (category === 'Searched'){
        googlePlacesInTrip.push(daySpotsArrayFlattened[j])
      }
      else if (!categoriesInTrip.includes(category)) {
        categoriesInTrip.push(category)
      }
    }
    if (daySpotsArrayFlattened.length === 0) {
      enqueueSnackbar("Your itinerary is empty", {variant: 'error'})
    } else {
      if (!tripId) {
        if (!authState.user) {
          enqueueSnackbar("You have to be logged in to save itinerary", {variant: 'error'})
          return
        }
        submitTrip({    
          variables: {
            guide: guideId,
            startDate: spotState.startDate.format("YYYY-MM-DD"),
            dayLists: daySpotsArray,
            categoriesInTrip,
            googlePlacesInTrip
          }
        })
      } else {
        console.log(tripId)
        editTrip({    
          variables: {
            tripId,
            startDate: spotState.startDate.format("YYYY-MM-DD"),
            dayLists: daySpotsArray,
            categoriesInTrip,
            googlePlacesInTrip
          }
        })
      }
    }
    
    
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
        return;
    }

    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return;
    }

    const start = spotState.columns[source.droppableId];
    const finish = spotState.columns[destination.droppableId];

    //if moving within the same column
    if (start === finish) {

        //no reordering within spots
        if (start.id === 'filtered-spots') {
          return
        }

        const column = spotState.columns[source.droppableId];
        const newspots = Array.from(column.spotIds);
        newspots.splice(source.index, 1);
        newspots.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...column,
            spotIds: newspots,
        };

        const newOrder = {
            ...spotState,
            columns: {
                ...spotState.columns,
                [newColumn.id]: newColumn,
            },
        };

        console.log('reording within same column', newOrder)
        dispatch({type:'REORDER', payload:{newOrder}});
        return;
    }

    //moving from one list to another

    let startspots = Array.from(start.spotIds);
    startspots = startspots.filter(el =>  el !=draggableId)
    const newStart = {
        ...start,
        spotIds: startspots,
    };


    const finishspots = Array.from(finish.spotIds);
    finishspots.splice(destination.index, 0, draggableId);
    const newFinish = {
        ...finish,
        spotIds: finishspots,
    };


    const newOrder = {
        ...spotState,
        columns: {
            ...spotState.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        },
    };

    console.log('moving to a different columns', newOrder);
    dispatch({type:'REORDER', payload:{newOrder}});
  }

  return (
    <div>
      <div>
        <PlaceAutoComplete clickFunction={searchedItemClicked} city='Berlin'/>
      </div>
      <Paper component="ul" className={classes.categoryChipBoard}>
        {categoryChips.map(data => {
          return (
            <li key={data.key}>
              <CategoryChip data={data} toggleClick={toggleClick} />
            </li>
          );
        })}
      </Paper>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          {spotState.filteredBoard.map(columnId => {
            const column = spotState.columns[columnId];
            const unfilteredSpots = column.spotIds.map(spotId => spotState.spots[spotId])

            const selectedCategories = currentlySelectedChips();
            const spots = unfilteredSpots.filter((spot) => selectedCategories.includes(spot.category))
            // console.log('filtering spots: ', spots);
            
            return <SpotsBoard key={columnId} boardId={columnId} spots={spots} />
          })}
        </div>
        <div className={classes.dateAndSave}>
          <DatePicker/>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            className={classes.saveButton}
            startIcon={<SaveIcon />}
            onClick={saveItinerary}
          >
            Save
          </Button>
        </div>
        <div className={classes.dayBoardContainer}>
          {spotState.dayBoard.map((columnId, index) => {
            const column = spotState.columns[columnId];
            const spots = column.spotIds.map(spotId => spotState.spots[spotId])
            let dateTitle = moment(spotState.startDate).add(index, 'days');
 

            return <DayBoard key={columnId} boardId={columnId} dateTitle={dateTitle} spots={spots}/>
          })}
        </div>
      </DragDropContext>
    </div>
  );
}


const GET_TRIP = gql`
  query getTrip($tripId: ID!){
    getTrip(tripId: $tripId){
      id
      guide{
        id
        categories
      }
      startDate
      dayLists
      categoriesInTrip
      googlePlacesInTrip
      spotsArray {
        id
        guide
        place {
          id
          name
          rating
          location
          hours
          businessStatus
        }
        category
        imgUrl
        content
      }
      filteredSpots
    }
  }
`

const SUBMIT_TRIP = gql`
  mutation submitTrip(
    $guide: ID!
    $startDate: String!
    $dayLists: [[String]]!
    $categoriesInTrip: [String]!
    $googlePlacesInTrip: [String]!
  ){
    submitTrip(
      guide: $guide
      startDate: $startDate
      dayLists: $dayLists
      categoriesInTrip: $categoriesInTrip
      googlePlacesInTrip: $googlePlacesInTrip
    ){
      id
    }
  }
`

const EDIT_TRIP = gql`
  mutation editTrip(
    $tripId: ID!
    $startDate: String!
    $dayLists: [[String]]!
    $categoriesInTrip: [String]!
    $googlePlacesInTrip: [String]!
  ){
    editTrip(
      tripId: $tripId
      startDate: $startDate
      dayLists: $dayLists
      categoriesInTrip: $categoriesInTrip
      googlePlacesInTrip: $googlePlacesInTrip
    ){
      id
      dayLists
      startDate
    }
  }
`

const GET_USER_TRIPS = gql`
    query getUserTrips(
        $userId: ID!
    ){
        getUserTrips(
            userId: $userId
        ){
            id
            guide{
                id
                coverImage
                city
            }
            dayLists
            startDate
        }
    }
`

const GET_SPOT = gql`
  query getSpot(
    $guideId: ID!
    $placeId: String!
  ){
    getSpot(
      guideId: $guideId
      placeId: $placeId
    ){
      id
      guide
      place {
        id
        name
        rating
        location
      }
      category
      imgUrl
      content
    }
  }
`

const GET_SPOTS = gql`
  query getSpots(
    $guideId: ID!
    $category: String!
  ){
    getSpots(
      guideId: $guideId
      category: $category
    ){
      id
      guide
      place {
        id
        name
        rating
        location
        businessStatus
        hours
      }
      category
      imgUrl
      content
    }
  }
`

const GET_GUIDE = gql`
  query getGuide(
    $guideId: ID!
  ){
    getGuide(
      guideId: $guideId
    ){
      name
      city
      categories
    }
  }
`

export default Planner;

/* to look up cache
import {client} from '../ApolloProvider';

const getFilteredData = () => {
  try {
    let freshFilteredData = []
    for (var i = 0; i < categoryChips.length; i ++){
          if (categoryChips[i].clicked){
          const cachedData = client.readQuery({
            query: GET_SPOTS,
            variables: {
                guideId,
                category : categoryChips[i].label}
          })
          freshFilteredData = freshFilteredData.concat(cachedData.getSpots)
        }
    }
    setFilteredData(freshFilteredData)
    let spots = {}
    let spotIds = [];
    for (var i = 0; i < freshFilteredData.length; i ++ ){
      spots[freshFilteredData[i].id] = freshFilteredData[i];
      spotIds.push(freshFilteredData[i].id)
    }
    orderState.spots = spots;
    orderState.columns["filtered-spots"].spotIds = spotIds
  } catch (err) {
    console.log(err)
  }
}
*/

/*
  <div className={classes.explanation}>
    <p>A sample Berlin guidebook implementation. Features:</p>
    <ul>
      <li>Filter categories as you like (except for 'cafe' - it's a dummy)</li>
      <li>Click on map pins to autoscroll to index cards</li>
      <li>Drag and drop cards to DayBoards below to plan your itinerary</li>
      <li>Number of dayboards will render according to Datepicker selection</li>
    </ul> 
  </div>
*/

// console.log(ObjectId.isValid(newSearchItem.id) && ObjectId(newSearchItem.id).toString() === newSearchItem.id)