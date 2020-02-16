import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from './column';
import Form from './form';

import { PlaceContext } from '../Store/PlaceContext';

function Board() {

    const { contextState, dispatch } = useContext(PlaceContext);

    const onDragEnd = result => {
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

        const start = contextState.columns[source.droppableId];
        const finish = contextState.columns[destination.droppableId];

        //if moving within the same column
        if (start === finish) {
            const column = contextState.columns[source.droppableId];
            const newplaceIds = Array.from(column.placeIds);
            newplaceIds.splice(source.index, 1);
            newplaceIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                placeIds: newplaceIds,
            };

            const newOrder = {
                ...contextState,
                columns: {
                    ...contextState.columns,
                    [newColumn.id]: newColumn,
                },
            };

            dispatch({ type:'CHANGE_ORDER', order: {newOrder}});
            return;
        }

        //moving from one list to another
        const startplaceIds = Array.from(start.placeIds);
        startplaceIds.splice(source.index, 1);
        const newStart = {
            ...start,
            placeIds: startplaceIds,
        };

        const finishplaceIds = Array.from(finish.placeIds);
        finishplaceIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            placeIds: finishplaceIds,
        };


        const newOrder = {
            ...contextState,
            columns: {
                ...contextState.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        dispatch({ type:'CHANGE_ORDER', order: {newOrder}});
    };

    return (
        <div>
            <Form/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='container'>
                    {contextState.columnOrder.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <Column key={column.id} column={column} places={places}/>
                    })}
                </div>
                <div className='container'>
                    {contextState.dataColumn.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <Column key={column.id} column={column} places={places}/>
                    })}
                </div>
            </DragDropContext>
        </div>
        
    );

}

export default Board;
