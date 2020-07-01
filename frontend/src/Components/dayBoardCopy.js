import React, {useRef} from 'react';
import { Droppable } from 'react-beautiful-dnd';

import SpotCard from './spotCard';
import GoogleMap from './googleMapCopy';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexDirection: "column",
      minWidth: 320,
      marginRight: 30,
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    },
    droppable: {
      padding: 8,
      flexGrow: 1,
      minHeight: 300,
      maxHeight: 500,
      minWidth: 200,
      overflowY: 'auto',
    }
  }));

function DayBoard(props) {

    const {boardId, spots} = props
    const classes = useStyles();


    let myref = useRef(null)
    const setRef = (dragRefFunction, ref) => {
      myref = ref;
      dragRefFunction(ref);
    }

    const executeScroll = (index) => {
      // const pixel = index * 310
      // console.dir(myref);
      // myref.scrollLeft = pixel;
      console.log('hi')
  }

    return (
      <div className={classes.root} >
        <Droppable 
          droppableId={boardId}
          direction="vertical"
        >
          {(provided) => (
              <div 
              className={classes.droppable} 
              ref={(ref) => setRef(provided.innerRef, ref)}
              {...provided.droppableProps}>
                {spots.map((spot, index) => <SpotCard key={spot.place.id} spot={spot} index={index} expanded={false}/>)}
                {provided.placeholder}
            </div>
          )}
        </Droppable>
        <GoogleMap city='Berlin' spots={spots} pinClicked={executeScroll}/>
      </div>
    )
}

export default DayBoard;