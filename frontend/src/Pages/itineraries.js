import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext';
import { PlaceContext } from '../Store/PlaceContext';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import {Card, CardMedia, CardContent, Typography, IconButton, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
    root: {
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

    console.log(itineraries);
    const itineraryCards = loading ?
        ""
        : itineraries.map((itinerary) => {
            return (
                <Link to={`/itinerary/${itinerary.id}`} key={itinerary.id}>
                    <Card className={classes.root}>
                        <CardMedia
                            className={classes.headerThumbnail}
                            image="https://i.imgur.com/zbBglmB.jpg"
                        />
                        <div>
                            <CardContent className={classes.headerTitle}>
                                <Typography variant="h5">
                                    {itinerary.city}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {itinerary.dayPlans.length} Days
                                </Typography>
                            </CardContent>
                        </div>
                        <IconButton
                            className={classes.nextButton}
                            disableRipple={true}
                            disableFocusRipple={true}
                        >
                            <NavigateNextIcon />
                        </IconButton>
                    </Card>
                </Link>
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
            user
            username
        }
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