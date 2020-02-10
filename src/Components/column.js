import React from 'react';
import { Droppable } from 'react-beautiful-dnd'

import Item from './item';

const column = (props) => {

    const {column, tasks} = props;

    return (
        <div className='board'>
            <h3>{column.title}</h3>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div className='column'
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => <Item key={task.id} task={task} index={index}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            
        </div>
    );
}

export default column;