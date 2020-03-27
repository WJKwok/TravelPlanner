import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import DayBoard from './dayBoard';
import CategoryBoard from './categoryBoard';
import Form from './form';

import { PlaceContext } from '../Store/PlaceContext';

function Page() {

    const { contextState, dispatch } = useContext(PlaceContext);

    const {
        loading,
        data
    } = useQuery(FETCH_USERS_QUERY);

    console.log(data);

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
            console.log(newOrder);
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

        console.log(newOrder);
        dispatch({ type:'CHANGE_ORDER', order: {newOrder}});
    };

    const addExtraDay = () => {
        dispatch({type:'ADD_EXTRA_DAY'});
    }

    console.log(contextState);

    return (
        <div>
            <Form/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='day-boards-container'>
                    {contextState.dayBoards.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <DayBoard key={column.id} column={column} places={places}/>
                    })}
                    {contextState.dayBoards.length > 0 ? <button className="extra-day" onClick={addExtraDay}>+</button> : ""}
                    
                </div>
                <div className='place-boards-container'>
                    {contextState.categoryBoards.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <CategoryBoard key={column.id} column={column} places={places}/>
                    })}
                </div>
            </DragDropContext>
        </div>
        
    );

}

const FETCH_USERS_QUERY = gql`
{
    getUsers{
        id
        username
        email
        createdAt
    }
}
`

export default Page;
