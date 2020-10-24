import React, {useState} from 'react';
import moment from 'moment';

import { iconDict } from './spotIcons'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardMedia, CardContent, Collapse, Typography, IconButton} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';

import {Draggable} from 'react-beautiful-dnd'

import GoogleDirectionLink from './googleDirectionLink'

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 300,
        maxWidth: 300,
        margin: 5,
        [theme.breakpoints.down(430)]: {
            minWidth: '90%'
        },
    },
    rootHighlighted: {
        minWidth: 300,
        // maxWidth: 300,
        margin: 5,
        [theme.breakpoints.down(430)]: {
            minWidth: '90%'
        },
        border: '1px solid grey'
    },
    wrongDay: {
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center'
    },
    openStatus: {
        fontSize: 12,
        verticalAlign: 'middle',
    },
    header: {
      display: 'flex',
    },
    headerThumbnail: {
        // width: 100,
        minWidth: 90,
        objectFit: 'cover'
    },
    headerTitle: {
        flex: '1 0 auto',
        "& .MuiTypography-h6": {
            lineHeight: 'normal'
        }
        // wordBreak: 'break-all',
    },
    rowOne:{
        paddingBottom: 10,
        display: 'flex',
        alignItems: 'center'
    },
    indexCircle: {
        // backgroundColor: 'grey',
        // color: 'white',
        // borderRadius: 5,
        padding: "0px 5px 0px 0px",
        fontSize: 18,
        fontWeight: 900
    },
    rating: {
        display: "flex",
        alignItems: 'center'
    },
    ratingNumber: {
        marginRight: 5,
        fontSize: 12
    },
    collapseContent:{
        maxHeight: 200,
        overflowY: 'scroll',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      "&:hover": {
        backgroundColor: "transparent"
      },
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }));


const SpotCard = React.memo((props) => {
    
    const {spot, index, date, day, highlight} = props;
    console.log(`me am rendered ${index}`)
    //const placeImgUrl = "/place/photo?maxheight=400&photoreference=" + place.photoRef + "&key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY; 

    const classes = useStyles();
    const [expanded, setExpanded] = useState(props.expanded);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const trimDayText = (dayText) => {
        const dayAndHoursArray = dayText.split('day')
        const trimmedDayText = dayAndHoursArray[0].slice(0,3) + dayAndHoursArray[1]
        return trimmedDayText
    }


    const eventCardRightDayBoard = (date, spot) => {
        // no date prop if in spotsBoard
        if(!date){
            return true
        }

        // if not an event card
        if(spot.category !== 'Event'){
            return true
        }

        if(spot.category === 'Event' && moment(date).isSame(spot.date, 'day')){
            return true
        }

        if(spot.category === 'Event' && !moment(date).isSame(spot.date, 'day')){
            return false
        }

    }

    const dayToArrayIndex = day === 0 ? 6 : day -1

    const businessStatus = spot.place.businessStatus === 'OPERATIONAL' ? 
        (<span className={classes.openStatus}>
            {spot.place.hours ? trimDayText(spot.place.hours[dayToArrayIndex]) : 'Hours Null'}
        </span>) : 
        (<span className={classes.openStatus}>
            {spot.place.businessStatus}
        </span>)

    // console.log(spot.place.name, spot.place.hours[-1]);
    
    return (
        <Draggable
            draggableId={spot.id} 
            index={index}
        >
            {(provided) => (
                <Card 
                    className={highlight ? classes.rootHighlighted : classes.root}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={classes.header} onClick={handleExpandClick}>
                        {expanded ? "" : <CardMedia
                        className={classes.headerThumbnail}
                        image={spot.imgUrl}
                        />}
                        <div>
                        <CardContent className={classes.headerTitle}>
                            <Typography className={classes.wrongDay}>
                                {eventCardRightDayBoard(date, spot) ? null : 'WRONG DAY'}
                            </Typography>
                            <Typography className={classes.rowOne}>
                                {iconDict[spot.category]}
                                <span className={classes.indexCircle}>{index+1}</span> 
                                {spot.category === 'Event' ? moment(spot.date).format("Do MMM YYYY") : businessStatus}
                            </Typography>
                            <Typography variant="h6">
                                {spot.category === 'Event' ? spot.eventName : spot.place.name}
                            </Typography>
                            <Typography className={classes.ratingNumber}>
                                {spot.category === 'Event' ? spot.place.name : null}
                            </Typography>
                            <div className={classes.rating}>
                                <Typography className={classes.ratingNumber}>
                                {spot.place.rating}  
                                </Typography>
                                <Rating defaultValue={spot.place.rating} precision={0.5} size="small" readOnly />
                            </div>
                        </CardContent>
                        </div>
                        {/* <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        disableRipple={true}
                        disableFocusRipple={true}
                        aria-expanded={expanded}
                        >
                            <ExpandMoreIcon />
                        </IconButton> */}
                    </div>
                    <Collapse className={classes.collapseContent} in={expanded} timeout="auto" unmountOnExit>
                        <CardMedia
                        className={classes.media}
                        image={spot.imgUrl}
                        />
                        <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {spot.content}
                        </Typography>
                        </CardContent>
                    </Collapse>
                    <GoogleDirectionLink place={spot.place}/>
                </Card>
            )}
        </Draggable>
    );
})

export default SpotCard;