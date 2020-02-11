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

    changeHandler = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    clickHandler = () => {
        console.log('hello');

        // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
        // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"
        const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        console.log(googlePlacesApi);
        fetch(`/place/textsearch/json?query=museum+hamburg+germany&key=${googlePlacesApi}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.results)
                console.log(data.results[0].name);

                var tasksFetched = {};
                var taskIds = [];

                for (var i = 0; i < data.results.length; i++) {
                    var taskObject = {};
                    taskObject['id'] = `task-${i}`;
                    taskObject['content'] = data.results[i].name;
                    console.log(taskObject);
                    taskIds.push(`task-${i}`);
                    tasksFetched[`task-${i}`] = taskObject;
                }

                const newState = {
                    ...this.state,
                    tasks: tasksFetched,
                    columns: {
                        ...this.state.columns,
                        'data-1': {
                            ...this.state.columns['data-1'],
                            taskIds: taskIds

                        }
                    }
                }

                this.setState(newState);
            })
            .catch(error => console.error(error))

        const columnsCount = this.state.number;

        var columns = {};
        var columnOrder = [];

        for (var i = 0; i < columnsCount; i++) {
            var dataObject = {};
            dataObject['id'] = `column-${i}`;
            dataObject['title'] = `Day ${i + 1}`;
            dataObject['taskIds'] = [];

            columns[`column-${i}`] = dataObject;
            columnOrder.push(`column-${i}`);
        }

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                ...columns,
            },
            columnOrder: [...columnOrder],
        }

        this.setState(newState);
    };

    render() {
        return (
            <div>
                <input id='number' value={this.state.number} onChange={this.changeHandler}/>
                <button onClick={this.clickHandler}>Submit</button>
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