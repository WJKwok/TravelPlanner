import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd'

import { PlaceContext } from '../Store/PlaceContext';

import Item from './item';
import GoogleMap from './googlemap';

function Board(props) {

    const {contextState, dispatch} = useContext(PlaceContext);
    const {column, places} = props;

    const manipulatePlaces = () => {
        const id = column.id;
        const currentOrder = contextState.columns[id].placeIds;
        currentOrder.pop();
        const newOrder = {
            ...contextState,
            columns: {
                ...contextState.columns,
                [id]: {
                    ...contextState.columns[id],
                    placeIds: currentOrder
                },
            },
        }

        console.log(newOrder);
        dispatch({ type:'CHANGE_ORDER', order: {newOrder}});

    }

    return (
        <div className='board-day'>
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
                        {places.map((place, index) => <Item key={place.id} place={place} index={index}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <button onClick={manipulatePlaces}>Calculate</button>
            <GoogleMap places={places}/>
        </div>
    );
}

export default Board;