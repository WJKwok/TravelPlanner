import React, { useState, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton} from '@material-ui/core/';
import SaveIcon from '@material-ui/icons/Save';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import DayBoard from '../Components/dayBoard';
import CategoryBoard from '../Components/categoryBoard';
import SearchBoard from '../Components/searchBoard';
import Form from '../Components/form';
import { onDragEnd } from '../utils/dndLogic';
import PlaceAutoComplete from '../Components/placeAutoComplete'
import { fetchCategories, fetchPlaceIds } from '../Services/googlePlaceApi'
import { GET_USER_ITINERARIES } from '../utils/graphql'

import { PlaceContext } from '../Store/PlaceContext';
import { AuthContext } from '../Store/AuthContext';


const useStyles = makeStyles({
    buttonDiv: {
        display: "flex",
        justifyContent: "flex-end",
    },
    saveButton: {
        height: 53,
    },
    addButton: {
        "&:hover": {
            backgroundColor: "transparent"
        },
    },
    explanation: {
        backgroundColor: 'grey',
        color: 'white',
        padding: 5,
        marginBottom: 10,
    },
    autoComplete: {
        width: 400,
        marginRight: 20
    }
})


function Itinerary(props) {

    const { authState } = useContext(AuthContext);
    const { placeState, dispatch } = useContext(PlaceContext);
    const [ itineraryId, setItineraryId ] = useState(props.match.params.itineraryId ? props.match.params.itineraryId : "");
    const [ saveError, setSaveError ] = useState("")

    const classes = useStyles();
    
    /* Causes infinite loop LOL
    if (props.match.params.itineraryId) {
        console.log('it is from the link');
        setItineraryId(props.match.params.itineraryId);
    };
    */

    async function fetchItineraryFromGoogle(data) {

        dispatch({type:"CLEAR_STATE"});

        const city = data.getItinerary.city;
        const dayPlans = data.getItinerary.dayPlans;
        dispatch({ type:"LOAD_EMPTY_DAYS", payload:{numberOfDays: dayPlans.length, city}})

        //await fetchPlaceIdsDaybyDay(dayPlans, dispatch)
        const placesFetched = await fetchPlaceIds(dayPlans);
        dispatch({ type:"LOAD_ENTIRE_ITINERARY", payload:{itinerary: data.getItinerary, placesFetched}})

        const placeTypes = ['Restaurants', "Hotels", "Tourist+attraction"];
        fetchCategories(placeTypes, city, dispatch);

    }

    // unnecessary if you don't need to access 'data' else where
    // const { data } = 
    useQuery(GET_ITINERARY, {
        // just doen't seem to work
        // skip: itineraryId !== placeState.itineraryId,
        onCompleted(data){
            console.log('yes i fired again!!!', itineraryId);
            console.log('place state id: ', placeState.itineraryId)
            // does not run when the component was not remounted and parameter in query does not change
            if (itineraryId !== placeState.itineraryId){
                fetchItineraryFromGoogle(data);
            }
        },
        variables: {itineraryId}
    })

    /* Tracking Changes in Data
    While data is from useQuery, it is tagged to an id; and when you update the document via useMutation, this data changes! Even though the 'data' variable is not from there.
    
    useEffect(() => {
        if(data){
            fetchItineraryFromGoogle();
        }
    }, [data])
    */

    const addCardToSearchBoard = (placeObject) => {
        dispatch({type:'ADD_SEARCH_ITEM', payload:{placeObject}})
    }

    const searchBoard = () => {
        const column = placeState.columns['searched-items'];
        const places = column.placeIds.map(placeId => 
            placeState.places[placeId]
        );

        return <SearchBoard key={column.id} column={column} places={places}/>
        
    }

    let itinerary = [];
    const mutation = itineraryId ? SAVE_ITINERARY : SUBMIT_ITINERARY;
    const [submitItinerary] = useMutation(mutation, {
        // 'result' is the second parameter!
        update(proxy, result){

            console.log('saved submit result:', result);
            // if(proxy.data.data.ROOT_QUERY.getUserItineraries){
            //     console.log("it's here!")
            // }

            try {

                const data = proxy.readQuery({
                    query: GET_USER_ITINERARIES,
                    variables: {
                        userId: authState.user.id
                    }
                });
    
                // writing to cache so that the query doesn't have to recall
                // for queries with variables, it is impt to define it during write query, else it would be a different cache, and it wouldn't be read.
                proxy.writeQuery({
                    query: GET_USER_ITINERARIES,
                    variables: {
                        userId: authState.user.id
                    },
                    data: {
                        getUserItineraries: [...data.getUserItineraries, result.data.submitItinerary]
                    }
                })
            } catch (err) {
                console.log('update cache error:', err);
            }
            
            

            // Unnecessary 
            // if (!itineraryId) {
            //     setItineraryId(result.data.submitItinerary.id)
            // }
            setSaveError("");
        },
        onError(err){
            console.log('error saving/submitting:', err);
            //setSaveError(err.graphQLErrors[0].extensions.exception.stacktrace[0]);
        },
        variables: {
            dayPlans: itinerary,
            city: placeState.location,
            id: itineraryId
        }
    })

    const addExtraDay = () => {
        dispatch({type:'ADD_EXTRA_DAY'});
    }

    const saveItinerary = () => {
        const days = placeState.dayBoards;
        for (var i = 0; i < days.length; i ++){
            itinerary.push({
                placeIds: placeState.columns[days[i]].placeIds
            });
            
        }
        //console.log(itinerary);
        submitItinerary();
    }

    console.log(placeState);

    return (
        <div>
            <div className={classes.explanation}>
                <p>An itinerary planner drawing data from google places API. Features:</p>
                <ul>
                    <li>Start by selecting destination and number of days</li>
                    <li>Drag and drop places of interest from categories below to days on top right</li>
                    <li>On the left, search for places of interest not suggested by google</li>
                    <li>If logged in, you can save itinerary and return to it</li>
                </ul> 
            </div>
            <Form/>
            {itineraryId !== placeState.itineraryId ? <p>Loading</p> : ""}
            {placeState.days !== 0 
            ? <DragDropContext onDragEnd={(result) => onDragEnd(result, placeState, dispatch)}>
                <div className='day-and-search'>
                    <div className={classes.autoComplete}>
                        <PlaceAutoComplete 
                            clickFunction={addCardToSearchBoard}
                            city={placeState.location}/>
                        {searchBoard()}
                    </div>
                    
                    
                    <div className='day-boards-container'>
                        {placeState.dayBoards.map(columnId => {
                            const column = placeState.columns[columnId];
                            const places = column.placeIds.map(placeId => 
                                placeState.places[placeId]
                            );

                            return <DayBoard key={column.id} column={column} places={places}/>
                        })}
                        {placeState.dayBoards.length > 0 ?
                            <IconButton 
                                className={classes.addButton}
                                disableRipple={true}
                                disableFocusRipple={true}
                                onClick={addExtraDay}>
                                <AddCircleOutlineRoundedIcon />
                            </IconButton>
                            : ""}
                    </div>
                </div>
                <div className={classes.buttonDiv}>
                    <Button 
                        className={classes.saveButton}
                        variant="outlined" 
                        size="medium" 
                        onClick={saveItinerary}
                        startIcon={<SaveIcon />}
                    >
                        Save Itinerary
                    </Button>
                </div>
                <div className={classes.buttonDiv}>
                    {saveError ? <p>{saveError}</p> : null}
                </div>
                {placeState.categoryBoards.length > 0 
                ? <div className='place-boards-container'>
                    {placeState.categoryBoards.map(columnId => {
                        const column = placeState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            placeState.places[placeId]
                        );
                        return <CategoryBoard key={column.id} column={column} places={places}/>
                    })}
                </div>
                : null}
                
            </DragDropContext>
            : ""}
        </div>
        
    );

}

const SUBMIT_ITINERARY =  gql`
    mutation submitItinerary(
        $dayPlans: [DayPlanInput]!
        $city: String!
    ){
        submitItinerary(
            dayPlans: $dayPlans
            city: $city
        ){
            id
            city
            dayPlans{
                placeIds
            }
            createdAt
            # can't populate user on save
        }
    }
`

const SAVE_ITINERARY = gql`
    mutation saveItinerary(
        $id: ID!
        $dayPlans: [DayPlanInput]!
    ){
        saveItinerary(
            dayPlans: $dayPlans
            id: $id
        ){
            id
            city
            dayPlans{
                placeIds
            }
            createdAt
            user {
                username
            }
        }
    }
`

const GET_ITINERARY = gql`
    query getItinerary(
        $itineraryId: ID!
    ){
        getItinerary(
            itineraryId: $itineraryId
        ){
            id
            city
            dayPlans{
                placeIds
            }
            createdAt
            user {
                username
            }
        }
    }
`

export default Itinerary;