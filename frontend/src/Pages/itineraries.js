import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

import { AuthContext } from '../Store/AuthContext';
import { PlaceContext } from '../Store/PlaceContext';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import {Card, CardMedia, CardContent, Typography, IconButton, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
    itineraryCard: {
        marginBottom: 15,
        display: 'flex',
    },
    headerThumbnail: {
        width: 100,
    },
    headerTitle: {
        flex: '1 0 auto',
    },
    nextButton: {
        marginLeft: "auto",
        "&:hover": {
            backgroundColor: "transparent",
            color: 'red'
        },
    },
})

function Itineraries() {

    const { authState } = useContext(AuthContext);
    const { dispatch } = useContext(PlaceContext);
    const classes = useStyles();

    const {
        loading,
        data: { getUserItineraries : itineraries } = {}
    } = useQuery(GET_USER_ITINERARIES, {
        variables: {
            userId: authState.user.id
        }
    });

    const [deleteItinerary] = useMutation(DELETE_ITINERARY, {
        update(proxy, result){
            console.log('done:', result.data.deleteItinerary)

            const data = proxy.readQuery({
                query: GET_USER_ITINERARIES,
                variables: {
                    userId: authState.user.id
                }
            })

            proxy.writeQuery({
                query: GET_USER_ITINERARIES,
                variables: {
                    userId: authState.user.id
                },
                data: {
                    getUserItineraries: data.getUserItineraries.filter(i => i.id !== result.data.deleteItinerary)
                }
            })

        },
        onError(err){
            console.log(err)
        }
    })

    const deleteHandler = (itineraryId) => {
        deleteItinerary({ variables: { itineraryId } })
    }

    console.log(itineraries);
    const itineraryCards = loading ?
        ""
        : itineraries.map((itinerary) => {
            return (
                <Card className={classes.itineraryCard} key={itinerary.id}>
                    <CardMedia
                        className={classes.headerThumbnail}
                        image="https://i.imgur.com/zbBglmB.jpg"
                    />
                    <Link to={`/itinerary/${itinerary.id}`}>
                        <CardContent className={classes.headerTitle}>
                            <Typography variant="h5">
                                {itinerary.city}
                            </Typography>
                            <Typography variant="subtitle1">
                                {itinerary.dayPlans.length} Days
                            </Typography>
                        </CardContent>
                    
                    </Link>
                    <IconButton
                        className={classes.nextButton}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => deleteHandler(itinerary.id)}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </Card>
            )})
    
    return (
        <div>
            {itineraryCards}
            <Link to={'/'}>
                <IconButton 
                    disableRipple={true}
                    disableFocusRipple={true}
                    onClick={() => dispatch({type:"CLEAR_STATE"})}>
                    <AddCircleOutlineRoundedIcon fontSize="large" />
                </IconButton>
            </Link>
        </div>
        
    );
}

const GET_USER_ITINERARIES = gql`
    query getUserItineraries(
        $userId: ID!
    ){
        getUserItineraries(
            userId: $userId
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

const DELETE_ITINERARY =  gql`
    mutation deleteItinerary($itineraryId: ID!){
        deleteItinerary(itineraryId: $itineraryId)
    }
`

/* with parameters ^, without parameters
const GET_USER_ITINERARIES = gql`
    query {
        getUserItineraries{
            id
            city
            dayPlans{
                placeIds
            }
            createdAt
            user
            username
        }
    }
`
*/

export default Itineraries;