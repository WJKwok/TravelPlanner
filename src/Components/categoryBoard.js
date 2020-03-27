import React from 'react';
import { Droppable } from 'react-beautiful-dnd'

import Item from './item';
import GoogleMap from './googlemap';

function CategoryBoard(props) {

    const {column, places} = props;

    return (
        <div className='place-board'>
            <p className="board-title">{column.title}</p>
            <Droppable 
                droppableId={column.id}
                direction="horizontal"
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
            <GoogleMap places={places}/>
        </div>
    );
}

export default CategoryBoard;