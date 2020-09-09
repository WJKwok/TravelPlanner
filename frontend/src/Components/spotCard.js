import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardMedia, CardContent, Collapse, Typography, IconButton} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';

import {Draggable} from 'react-beautiful-dnd'

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 300,
        maxWidth: 300,
        margin: 10,
    },
    rootHighlighted: {
        minWidth: 300,
        maxWidth: 300,
        margin: 10,
        border: '1px solid grey'
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
        backgroundColor: 'grey',
        color: 'white',
        borderRadius: 5,
        padding: "0px 5px",
        marginRight: 5
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


function SpotCard(props) {

    const {spot, index, day, highlight} = props;
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
                            <Typography className={classes.rowOne}>
                                <span className={classes.indexCircle}>{index+1}</span> {businessStatus}
                            </Typography>
                            <Typography variant="h6">
                                {spot.place.name}
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
                </Card>
            )}
        </Draggable>
    );
}

export default SpotCard;