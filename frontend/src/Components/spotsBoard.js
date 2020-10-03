import React, {useRef, useState} from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import SpotCard from './spotCard';
import GoogleMap from './googleMapCopy';
import DaySelectMenu from './daySelectMenu'

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      overflowX: "auto",
      alignItems: "flex-start",
      minHeight: 300,
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
      padding: 10,
    },
  }));

function SpotsBoard(props) {
    const classes = useStyles();
    const {boardId, spots} = props
    const [selectedIndex, setSelectedIndex] = useState(undefined)

    const [day, setDay] = useState(moment().startOf('date').day())

    let myref = useRef(null)
    const setRef = (dropRefFunction, ref) => {
      myref = ref
      dropRefFunction(ref);
    }

    const executeScroll = (index) => {
        const pixel = index * 320 + 10
        setSelectedIndex(index)
        myref.scrollLeft = pixel;
    }

    const placeHolderText = <p>Click on the category chips above 👆 to display cards.</p>

    return (
      <div>
        <DaySelectMenu day={day} dayChangeHandler={setDay}/>
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
              {spots.length > 0 ? spots.map((spot, index) => <SpotCard key={spot.id} spot={spot} day={day} index={index} expanded={true} highlight={selectedIndex === index}/>) : placeHolderText}
            {provided.placeholder}
          </div>)}
        </Droppable>
        <GoogleMap city='Berlin' spots={spots} pinClicked={executeScroll}/>
      </div>
    )
}

export default SpotsBoard;