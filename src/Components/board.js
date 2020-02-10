import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import initialData from '../Store/initial-data';
import Column from './column';

class Board extends Component {

    state = initialData;

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        //if moving within the same column
        if (start === finish) {
            const column = this.state.columns[source.droppableId];
            const newTaskIds = Array.from(column.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                taskIds: newTaskIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        //moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };


        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        this.setState(newState);
    };

    clickHandler = () => {
        console.log('hello');

        const columnsCount = this.state.columnOrder.length + 2;
        const newColumn = `column-${columnsCount}`;

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newColumn]: {
                    id: newColumn,
                    title: 'the end',
                    taskIds: [],
                },
            },
            columnOrder: [...this.state.columnOrder, newColumn],
        }

        this.setState(newState);
    
    };

    render() {
        return (
            <div>
                <button onClick={this.clickHandler}>Add column</button>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className='container'>
                        {this.state.columnOrder.map(columnId => {
                            const column = this.state.columns[columnId];
                            const tasks = column.taskIds.map(taskId => 
                                this.state.tasks[taskId]
                            );

                            return <Column key={column.id} column={column} tasks={tasks}/>
                        })}
                    </div>
                    <div className='container'>
                        {this.state.dataColumn.map(columnId => {
                            const column = this.state.columns[columnId];
                            const tasks = column.taskIds.map(taskId => 
                                this.state.tasks[taskId]
                            );

                            return <Column key={column.id} column={column} tasks={tasks}/>
                        })}
                    </div>
                </DragDropContext>
            </div>
            
        );
    }
}

export default Board;