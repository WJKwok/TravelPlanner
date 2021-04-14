import React, { useContext, useState, useEffect } from 'react';

import { SpotContext } from '../../Store/SpotContext';
import { AuthContext } from '../../Store/AuthContext';
import { SnackBarContext } from '../../Store/SnackBarContext';

import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import { SPOT_DATA } from '../../utils/graphql';

import CategoryChipBar from '../../Components/categoryChipBarWeb';
import ScrollBoardWithinMap from '../../Components/scrollBoardWithinMapWeb';
import ScrollBoardWithinMapMobile from '../../Components/scrollBoardWithinMapMobile';
import { ListPage } from 'Components/listPage';
import AuthModal from '../../Components/AuthModal';
import ConfirmNavPrompt from '../../Components/confirmNavPrompt';
import ProfileIconButton from '../../Components/profileIconButton';
import DatePicker from '../../Components/datePicker';
import PlaceAutoComplete from '../../Components/placeAutoComplete';

import ListIcon from '@material-ui/icons/List';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
  searchDialogSize: {
    minHeight: 300,
    padding: '13px',
  },
  searchButton: {
    margin: '0px 0px 5px 0px',
    [theme.breakpoints.down(430)]: {
      margin: '0px 0px 10px 10px',
    },
  },
  iconButton: {
    backgroundColor: 'white',
    color: 'black',
    '&:focus': {
      outline: 'none',
    },
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
  iconRoot: {
    textAlign: 'center',
  },
  buttonGroup: {
    backgroundColor: 'white',
    color: 'black',
  },
}));

function Planner(props) {
  const { authState } = useContext(AuthContext);
  const { spotState, dispatch } = useContext(SpotContext);
  const { setSnackMessage } = useContext(SnackBarContext);

  const classes = useStyles();
  const [newSearchItem, setNewSearchItem] = useState({});
  const [tripId, setTripId] = useState(props.match.params.tripId);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const guideId = props.match.params.guideBookId;

  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${theme.maxMobileWidth}px)`);

  useEffect(() => {
    return () => {
      console.log('clearing state...');
      dispatch({ type: 'CLEAR_STATE' });
    };
  }, [dispatch]);

  useQuery(GET_GUIDE, {
    skip: tripId,
    onCompleted({ getGuide }) {
      dispatch({ type: 'LOAD_GUIDE', payload: { guide: getGuide } });
    },
    variables: {
      guideId,
    },
  });

  useQuery(GET_TRIP, {
    skip: tripId === undefined,
    onCompleted({ getTrip: trip }) {
      console.log('get trip: ', trip);
      dispatch({ type: 'LOAD_MAP', payload: { map: trip } });
    },
    onError(err) {
      console.log('GETTRIP error', err);
    },
    variables: { tripId },
  });

  const [getSpotsForCategoryInGuide, { variables }] = useLazyQuery(GET_SPOTS, {
    onCompleted({ getSpotsForCategoryInGuide }) {
      dispatch({
        type: 'ADD_SPOTS',
        payload: {
          newSpots: getSpotsForCategoryInGuide,
          category: variables.category,
          spotToHighlightID: variables.itemId,
        },
      });
    },
  });

  const [getSpot] = useLazyQuery(GET_SPOT, {
    onCompleted({ getSpot }) {
      if (!getSpot) {
        dispatch({ type: 'ADD_SEARCH_ITEM', payload: { newSearchItem } });
        setSnackMessage({
          text: "Spot has been added in 'Searched' :)",
          code: 'Confirm',
        });
      } else {
        const itemCategory = getSpot.categories[0];
        getSpotsForCategoryInGuide({
          variables: {
            guideId,
            category: itemCategory,
            itemId: getSpot.id,
          },
        });
        setSnackMessage({
          text: `item is in ${itemCategory} :)`,
          code: 'Info',
        });
        // chipClickedTrue(itemCategory); //TODO:
      }
    },
  });

  const [submitTrip] = useMutation(SUBMIT_TRIP, {
    onCompleted({ submitTrip }) {
      console.log(submitTrip);
      setTripId(submitTrip.id);
      dispatch({ type: 'TRIP_SAVED' });
      setSnackMessage({ text: 'Your trip has been saved:)', code: 'Confirm' });
    },
    update(proxy, result) {
      console.log('submitTrip result:', result);

      try {
        const data = proxy.readQuery({
          query: GET_USER_TRIPS,
          variables: {
            userId: authState.user.id,
          },
        });

        // writing to cache so that the query doesn't have to recall
        // for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
        proxy.writeQuery({
          query: GET_USER_TRIPS,
          variables: {
            userId: authState.user.id,
          },
          data: {
            getUserTrips: [...data.getUserTrips, result.data.submitTrip],
          },
        });
      } catch (err) {
        console.log('update cache error:', err);
      }
    },
    onError(err) {
      console.log(err);
    },
  });

  const [editTrip] = useMutation(EDIT_TRIP, {
    onCompleted({ editTrip }) {
      console.log('Trip edited', editTrip);
      setTripId(editTrip.id);
      dispatch({ type: 'TRIP_SAVED' });
      setSnackMessage({ text: 'Your trip has been saved:)', code: 'Confirm' });
    },
    update(proxy, result) {
      try {
        const data = proxy.readQuery({
          query: GET_TRIP,
          variables: {
            tripId,
          },
        });

        console.log(
          'spotState.spots',
          spotState.spots,
          Object.values(spotState.spots)
        );
        // writing to cache so that the query doesn't have to recall
        // for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
        proxy.writeQuery({
          query: GET_TRIP,
          variables: {
            tripId,
          },
          data: {
            getTrip: {
              ...data.getTrip,
              filteredSpots: spotState.columns['filtered-spots'].spotIds,
              spotsArray: [...Object.values(spotState.spots)],
              categoriesInTrip: spotState.queriedCategories, //TODO: get categories from liked spots
              likedSpots: spotState.columns['filtered-spots'].spotIds.filter(
                (spot) => spotState.spots[spot].liked
              ),
              googlePlacesInTrip: spotState.columns[
                'filtered-spots'
              ].spotIds.filter(
                (spot) => spotState.spots[spot].categories[0] === 'Searched'
              ),
            },
          },
        });
      } catch (err) {
        console.log('update cache error:', err);
      }
    },
    onError(err) {
      console.log(err);
    },
  });

  const saveItinerary = () => {
    console.log('spotState:', spotState);

    let googlePlacesInTrip = [];
    let daySpotsArray = [[]];

    const allspots = spotState.spots;
    const likedSpots = Object.keys(allspots).filter((id) => allspots[id].liked);
    const likedCategory = [];
    for (let k = 0; k < likedSpots.length; k++) {
      likedCategory.push.apply(
        likedCategory,
        allspots[likedSpots[k]].categories
      );
      if (spotState.spots[likedSpots[k]].categories[0] === 'Searched') {
        googlePlacesInTrip.push(likedSpots[k]);
      }
    }

    const categoriesInTrip = likedCategory;

    if (likedSpots.length === 0) {
      setSnackMessage({
        text: 'Your itinerary is empty or you have no liked spots',
        code: 'Error',
      });
    } else {
      if (!tripId) {
        if (!authState.user) {
          setRegisterOpen(true);
          setSnackMessage({
            text: 'You have to be logged in to save itinerary',
            code: 'Error',
          });
          return;
        }
        submitTrip({
          variables: {
            guide: guideId,
            startDate: spotState.startDate.format('YYYY-MM-DD'),
            dayLists: daySpotsArray,
            categoriesInTrip,
            likedSpots,
            googlePlacesInTrip,
          },
        });
      } else {
        console.log('trip is edited', tripId);
        editTrip({
          variables: {
            tripId,
            startDate: spotState.startDate.format('YYYY-MM-DD'),
            dayLists: daySpotsArray,
            categoriesInTrip,
            likedSpots,
            googlePlacesInTrip,
          },
        });
      }
    }
  };

  const searchedItemClicked = (searchedItem) => {
    setSearchModalOpen(false);
    for (var key in spotState.spots) {
      if (spotState.spots[key].place.id === searchedItem.id) {
        console.log('STOP DO NOT ADD');
        dispatch({
          type: 'HIGHLIGHT_EXISTING_ITEM',
          payload: { searchedItem: spotState.spots[key] },
        });
        setSnackMessage({ text: 'Item already exists', code: 'Info' });
        return;
      }
    }

    const reshapedItem = {
      __typename: 'Spot',
      categories: ['Searched'],
      content: '',
      guide: 'Searched',
      id: searchedItem.id,
      imgUrl: ['https://i.imgur.com/zbBglmB.jpg'],
      place: {
        __typename: 'Place',
        id: searchedItem.id,
        location: [searchedItem.location.lat, searchedItem.location.lng],
        name: searchedItem.name,
        rating: searchedItem.rating,
        userRatingsTotal: searchedItem.userRatingsTotal,
        businessStatus: searchedItem.businessStatus,
        hours: searchedItem.hours,
        reviews: searchedItem.reviews,
        internationalPhoneNumber: searchedItem.internationalPhoneNumber,
        website: searchedItem.website,
        address: searchedItem.address,
      },
    };

    setNewSearchItem(reshapedItem);

    getSpot({
      variables: {
        guideId,
        placeId: searchedItem.id,
      },
    });
  };

  const renderSpotsBoard = () => {
    const columnId = spotState.filteredBoard[0];
    const column = spotState.columns[columnId];
    const unfilteredSpots = column.spotIds.map(
      (spotId) => spotState.spots[spotId]
    );

    const selectedCategories = spotState.clickedCategories;
    const filteredSpots = unfilteredSpots.filter((spot) =>
      spot.categories.some((cat) => selectedCategories.includes(cat))
    );

    const likedSpots = unfilteredSpots.filter((spot) => spot.liked);
    const spots = [...new Set([...filteredSpots, ...likedSpots])];

    console.log('filtering spots: ', spots);

    console.log('main coordinates:', spotState.guide.coordinates);

    if (isMobile) {
      if (isListView) {
        return (
          <ListPage
            spots={spots}
            catBar={<CategoryChipBar />}
            setIsListView={setIsListView}
          />
        );
      } else {
        return (
          <ScrollBoardWithinMapMobile
            dragAndDroppable={true}
            key={columnId}
            boardId={columnId}
            spots={spots}
            coordinates={spotState.guide.coordinates}
            catBar={<CategoryChipBar />}
            gSearchButton={
              <ButtonGroup
                variant="contained"
                aria-label="contained primary button group"
                classes={{
                  groupedContained: classes.iconButton,
                }}
              >
                <Button
                  data-testid="google-search-button"
                  onClick={() => setSearchModalOpen(true)}
                >
                  <Icon classes={{ root: classes.iconRoot }}>
                    <img
                      className={classes.imageIcon}
                      src="/images/search.png"
                    />
                  </Icon>
                </Button>
                <Button id="save" onClick={saveItinerary}>
                  <SaveIcon />
                </Button>
                <Button id="list" onClick={() => setIsListView(true)}>
                  <ListIcon />
                </Button>
              </ButtonGroup>
            }
            rightButtons={<ProfileIconButton />}
          />
        );
      }
    }
    return (
      <ScrollBoardWithinMap
        dragAndDroppable={true}
        key={columnId}
        boardId={columnId}
        spots={spots}
        coordinates={spotState.guide.coordinates}
        catBar={<CategoryChipBar />}
        gSearchButton={
          <ButtonGroup
            variant="contained"
            aria-label="contained primary button group"
            classes={{
              groupedContained: classes.iconButton,
            }}
          >
            <Button
              data-testid="google-search-button"
              onClick={() => setSearchModalOpen(true)}
              className={classes.iconButton}
            >
              <Icon classes={{ root: classes.iconRoot }}>
                <img className={classes.imageIcon} src="/images/search.png" />
              </Icon>
            </Button>
            <Button
              id="save"
              onClick={saveItinerary}
              className={classes.iconButton}
            >
              <SaveIcon />
            </Button>
          </ButtonGroup>
        }
        rightButtons={<ProfileIconButton />}
      />
    );
  };

  const placeAutoCompletePlaceHolderText = 'Google a place of interest 🙌';
  console.log('unsaved web?', spotState.unsavedChanges);

  return spotState.guide ? (
    <div>
      <ConfirmNavPrompt
        when={spotState.unsavedChanges === true}
        navigate={(path) => props.history.push(path)}
      />
      <Dialog
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        fullWidth={true}
      >
        <div className={classes.searchDialogSize}>
          <PlaceAutoComplete
            clickFunction={searchedItemClicked}
            city={spotState.guide.city}
            coordinates={spotState.guide.coordinates}
            placeHolderText={placeAutoCompletePlaceHolderText}
          />
        </div>
      </Dialog>

      <div>{renderSpotsBoard()}</div>
      <AuthModal
        registerOpen={registerOpen}
        setRegisterOpen={setRegisterOpen}
      />
    </div>
  ) : null;
}

const GET_GUIDE = gql`
  query getGuide($guideId: ID!) {
    getGuide(guideId: $guideId) {
      id
      name
      city
      coordinates
      categories
      plannerImage
      logo
    }
  }
`;

const GET_TRIP = gql`
  query getTrip($tripId: ID!) {
    getTrip(tripId: $tripId) {
      id
      guide {
        id
        name
        city
        coordinates
        categories
        plannerImage
      }
      startDate
      dayLists
      categoriesInTrip
      googlePlacesInTrip
      spotsArray {
        ...SpotData
      }
      filteredSpots
      likedSpots
    }
  }
  ${SPOT_DATA}
`;

const SUBMIT_TRIP = gql`
  mutation submitTrip(
    $guide: ID!
    $startDate: String!
    $dayLists: [[String]]!
    $categoriesInTrip: [String]!
    $likedSpots: [String]!
    $googlePlacesInTrip: [String]!
  ) {
    submitTrip(
      guide: $guide
      startDate: $startDate
      dayLists: $dayLists
      categoriesInTrip: $categoriesInTrip
      likedSpots: $likedSpots
      googlePlacesInTrip: $googlePlacesInTrip
    ) {
      id
    }
  }
`;

const EDIT_TRIP = gql`
  mutation editTrip(
    $tripId: ID!
    $startDate: String!
    $dayLists: [[String]]!
    $categoriesInTrip: [String]!
    $likedSpots: [String]!
    $googlePlacesInTrip: [String]!
  ) {
    editTrip(
      tripId: $tripId
      startDate: $startDate
      dayLists: $dayLists
      categoriesInTrip: $categoriesInTrip
      likedSpots: $likedSpots
      googlePlacesInTrip: $googlePlacesInTrip
    ) {
      id
      dayLists
      startDate
    }
  }
`;

const GET_USER_TRIPS = gql`
  query getUserTrips($userId: ID!) {
    getUserTrips(userId: $userId) {
      id
      guide {
        id
        coverImage
        city
      }
      dayLists
      startDate
    }
  }
`;

const GET_SPOT = gql`
  query getSpot($guideId: ID!, $placeId: String!) {
    getSpot(guideId: $guideId, placeId: $placeId) {
      ...SpotData
    }
  }
  ${SPOT_DATA}
`;

const GET_SPOTS = gql`
  query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
    getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
      ...SpotData
    }
  }
  ${SPOT_DATA}
`;

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
          freshFilteredData = freshFilteredData.concat(cachedData.getSpotsForCategoryInGuide)
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
