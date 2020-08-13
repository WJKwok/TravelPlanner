import React, {useRef} from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import SpotCard from './spotCard';
import GoogleMap from './googleMapCopy';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      overflowX: "auto",
      alignItems: "flex-start",
      minHeight: 300,
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
      padding: 10,
    }
  }));

function SpotsBoard(props) {

    const {boardId, spots} = props
    const classes = useStyles();

    let myref = useRef(null)
    const setRef = (dropRefFunction, ref) => {
      myref = ref
      dropRefFunction(ref);
    }

    const executeScroll = (index) => {
        const pixel = index * 320 + 10
        console.dir(myref);
        myref.scrollLeft = pixel;
    }

    return (
      <div>
        <Droppable 
          droppableId={boardId}
          direction="horizontal"
        >
          {(provided) => (
          <div 
            className={classes.root}
            ref={(ref) => setRef(provided.innerRef, ref)}
            {...provided.droppableProps}
            >
              {spots.map((spot, index) => <SpotCard key={spot.id} spot={spot} day={moment().startOf('date').day()} index={index} expanded={true}/>)}
            {provided.placeholder}
          </div>)}
        </Droppable>
        <GoogleMap city='Berlin' spots={spots} pinClicked={executeScroll}/>
      </div>
    )
}

export default SpotsBoard;