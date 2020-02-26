import React from 'react';
import { Droppable } from 'react-beautiful-dnd'

import Item from './item';

function HorizontalColumn(props) {

    const {column, places} = props;

    return (
        <div className='board-horizontal'>
            <h3>{column.title}</h3>
            <Droppable 
                droppableId={column.id}
                direction="horizontal"
            >
                {(provided) => (
                    <div className='column-horizontal'
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {places.map((place, index) => <Item key={place.id} place={place} index={index}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default HorizontalColumn;