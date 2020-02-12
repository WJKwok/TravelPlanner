import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const item = (props) => {

    const {place, index} = props;
    return (
        <Draggable draggableId={place.id} 
            index={index}
        >
            {(provided) => (
                <div className='item'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <p>{place.content}</p>
                    <p>{place.rating}</p>
                </div>
            )}
        </Draggable>
    );
}

export default item;

// draggable attribute
// isDragDisabled={place.id === 'place-1'}