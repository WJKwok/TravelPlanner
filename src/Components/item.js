import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const item = (props) => {

    const {task, index} = props;
    return (
        <Draggable draggableId={task.id} 
            index={index}
        >
            {(provided) => (
                <div className='item'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <p>{task.content}</p>
                    <p>{task.rating}</p>
                </div>
            )}
        </Draggable>
    );
}

export default item;

// draggable attribute
// isDragDisabled={task.id === 'task-1'}