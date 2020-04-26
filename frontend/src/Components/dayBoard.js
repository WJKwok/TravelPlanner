import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd'

//import { PlaceContext } from '../Store/PlaceContext';

import Item from './item';
import GoogleMap from './googlemap';

function DayBoard(props) {

    const {column, places} = props;

    //const {placeState, dispatch} = useContext(PlaceContext);

    // const manipulatePlaces = () => {
    //     const id = column.id;
    //     const currentOrder = placeState.columns[id].placeIds;
    //     currentOrder.pop();
    //     const newOrder = {
    //         ...placeState,
    //         columns: {
    //             ...placeState.columns,
    //             [id]: {
    //                 ...placeState.columns[id],
    //                 placeIds: currentOrder
    //             },
    //         },
    //     }

    //     console.log(newOrder);
    //     dispatch({ type:'CHANGE_ORDER', order: {newOrder}});

    // }

    return (
        <div className='day-board'>
            <p className="board-title">{column.title}</p>
            <Droppable 
                droppableId={column.id}
                direction="vertical"
            >
                {(provided) => (
                    <div className='droppable'
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {places.map((place, index) => <Item key={place.id} place={place} index={index} expanded={false}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {/* <button onClick={manipulatePlaces}>Calculate</button> */}
            <GoogleMap places={places}/>
        </div>
    );
}

export default DayBoard;