import React from 'react';
import { Droppable } from 'react-beautiful-dnd'

import Item from './item';
import GoogleMap from './googlemap';

function SearchBoard(props) {

    const {column, places} = props;

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
            { places.length > 0 
            ? <GoogleMap places={places}/>
            : null
            }
        </div>
    );
}

export default SearchBoard;