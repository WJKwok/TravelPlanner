import React, {useContext} from 'react'
import { useQuery, useLazyQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {DragDropContext} from 'react-beautiful-dnd'
import moment from 'moment';

import CategoryChip from '../Components/categoryChip';
import SpotsBoard from '../Components/spotsBoard';
import DayBoard from '../Components/dayBoardCopy';
import DatePicker from '../Components/datePicker';
import { SpotContext } from '../Store/SpotContext';

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LocalMallIcon from "@material-ui/icons/LocalMall";
// import BookIcon from "@material-ui/icons/Book";
// import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
// import StorefrontIcon from "@material-ui/icons/Storefront";

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
  }
}));

function Planner() {
  const classes = useStyles();
  const [categoryChips, setCategoryChips] = React.useState([]);
  const [queriedVariables, setQueriedVariables] = React.useState([])
  const {spotState, dispatch} = useContext(SpotContext)

  const iconDict = {
      Retail: <LocalMallIcon />,
      Cafe: <LocalCafeIcon />,
      Restaurant: <RestaurantIcon />,
      Museum: <AccountBalanceIcon />
  }

  //temporary for testing
  const guideId = "5ed7aee473e66d73abe88279";
  console.log('queriedVariables: ', queriedVariables);

  const [getSpots] = useLazyQuery(GET_SPOTS, {
    onCompleted({getSpots}){  //deconstruct from data
      dispatch({type:'ADD_SPOTS', payload:{newSpots: getSpots}})
      if (getSpots.length > 0) {
          setQueriedVariables([...queriedVariables, getSpots[0].category])
      }
    },
  })

  useQuery(GET_GUIDE, {
    onCompleted({getGuide}){
      console.log('guide: ', getGuide)
      getCategories(getGuide)
    },
    variables: {
      guideId,
    }
  })

  const getCategories = (guide) => {
    let categories = guide.categories.map(category => {
        return {
            key: category,
            label: category,
            icon: iconDict[category],
            clicked: false
        }
    })
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

        console.log(newOrder)
        dispatch({type:'REORDER', payload:{newOrder}});
        return;
    }

    //moving from one list to another
    const startspots = Array.from(start.spotIds);
    startspots.splice(source.index, 1);
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

    console.log(newOrder);
    dispatch({type:'REORDER', payload:{newOrder}});
  }

  return (
    <div>
      <div className={classes.explanation}>
        <p>A sample Berlin guidebook implementation. Features:</p>
        <ul>
          <li>Filter categories as you like (except for 'cafe' - it's a dummy)</li>
          <li>Click on map pins to autoscroll to index cards</li>
          <li>Drag and drop cards to DayBoards below to plan your itinerary</li>
          <li>Number of dayboards will render according to Datepicker selection</li>
        </ul> 
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
            
            return <SpotsBoard key={columnId} boardId={columnId} spots={spots} />
          })}
        </div>
        <DatePicker/>
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