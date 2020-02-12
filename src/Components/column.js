import React from 'react';
import { Droppable } from 'react-beautiful-dnd'

import Item from './item';

const column = (props) => {

    const {column, places} = props;

    return (
        <div className={column.id === 'data-1' ? 'board-horizontal' : 'board'}>
            <h3>{column.title}</h3>
            <Droppable 
                droppableId={column.id}
                direction={column.id === 'data-1' ? "horizontal" : "vertical"}
            >
                {(provided) => (
                    <div className={column.id === 'data-1' ? 'column-horizontal' : 'column'}
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

export default column;