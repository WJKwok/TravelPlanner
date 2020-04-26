import React, {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardMedia, CardContent, Collapse, Typography, IconButton} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 370,
      maxWidth: 370,
      margin: 5,
    },
    header: {
      display: 'flex',
    },
    headerThumbnail: {
        width: 100,
    },
    headerTitle: {
        flex: '1 0 auto',
    },
    rating: {
        display: "flex",
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


function Item(props) {

    const {place, index} = props;
    //const placeImgUrl = "/place/photo?maxheight=400&photoreference=" + place.photoRef + "&key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY; 

    const classes = useStyles();
    const [expanded, setExpanded] = useState(props.expanded);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    
    return (
        <Draggable draggableId={place.id} 
            index={index}
        >
            {(provided) => (
                <Card 
                    className={classes.root}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={classes.header} onClick={handleExpandClick}>
                        {expanded ? "" : <CardMedia
                        className={classes.headerThumbnail}
                        image="https://i.imgur.com/zbBglmB.jpg"
                        />}
                        <div>
                        <CardContent className={classes.headerTitle}>
                            <Typography>
                            {index+1}. {place.content}
                            </Typography>
                            <div className={classes.rating}>
                                <Typography>
                                {place.rating}  
                                </Typography>
                                <Rating defaultValue={place.rating} precision={0.5} readOnly />
                            </div>
                        </CardContent>
                        </div>
                        <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        disableRipple={true}
                        disableFocusRipple={true}
                        aria-expanded={expanded}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <Collapse className={classes.collapseContent} in={expanded} timeout="auto" unmountOnExit>
                        <CardMedia
                        className={classes.media}
                        image="https://i.imgur.com/zbBglmB.jpg"
                        />
                        <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            )}
        </Draggable>
    );
}

export default Item;