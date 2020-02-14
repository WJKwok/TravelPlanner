import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import initialData from '../Store/initial-data';
import Column from './column';

function Board() {

    const [state, setState] = React.useState(initialData);

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

        const start = state.columns[source.droppableId];
        const finish = state.columns[destination.droppableId];

        //if moving within the same column
        if (start === finish) {
            const column = state.columns[source.droppableId];
            const newplaceIds = Array.from(column.placeIds);
            newplaceIds.splice(source.index, 1);
            newplaceIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                placeIds: newplaceIds,
            };

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setState(newState);
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


        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        setState(newState);
    };

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    };

    const clickHandler = async () => {

        //setting number of columns

        const columnsCount = state.number;

        var columns = {};
        var columnOrder = [];

        for (var i = 0; i < columnsCount; i++) {
            var dataObject = {};
            dataObject['id'] = `column-${i}`;
            dataObject['title'] = `Day ${i + 1}`;
            dataObject['placeIds'] = [];

            columns[`column-${i}`] = dataObject;
            columnOrder.push(`column-${i}`);
        }

        // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
        // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"
        const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        const place = state.place;
        const type = state.type;

        const response = await fetch(`/place/textsearch/json?query=${type}+${place}&key=${googlePlacesApi}`)
        const data = await response.json();
        
        console.log(data.results)

        var placesFetched = {};
        var placeIds = [];
        
        for (var j = 0; j < data.results.length; j++) {

            //object structure of place card is set here

            var placeObject = {};
            placeObject['id'] = `place-${j}`;
            placeObject['content'] = data.results[j].name;
            placeObject['rating'] = data.results[j].rating;
            placeObject['photoRef'] = data.results[j].photos ? data.results[j].photos[0].photo_reference : "0";
            console.log(placeObject);
            placeIds.push(`place-${j}`);
            placesFetched[`place-${j}`] = placeObject;
        
        }

        columns['data-1'] = {
            ...state.columns['data-1'],
            placeIds: placeIds
        }
        
        const newState = {
            ...state,
            places: placesFetched,
            columns: {
                ...state.columns,
                ...columns,
            },
            columnOrder: [...columnOrder],
        }

        setState(newState);
    
    };

    return (
        <div>
            <div>
                <select className="select-css" id='type' value={state.type} onChange={changeHandler}>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Tourist+attraction">Tourist+attraction</option>
                </select>
                <input id='place' placeholder='City' type="text" value={state.place} onChange={changeHandler}/>
                <input id='number' placeholder='No. of Days' type="text" value={state.number} onChange={changeHandler}/>
                <button type='submit' onClick={clickHandler}>Submit</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='container'>
                    {state.columnOrder.map(columnId => {
                        const column = state.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            state.places[placeId]
                        );

                        return <Column key={column.id} column={column} places={places}/>
                    })}
                </div>
                <div className='container'>
                    {state.dataColumn.map(columnId => {
                        const column = state.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            state.places[placeId]
                        );

                        return <Column key={column.id} column={column} places={places}/>
                    })}
                </div>
            </DragDropContext>
        </div>
        
    );

}

export default Board;