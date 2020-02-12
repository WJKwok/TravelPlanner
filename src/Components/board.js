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
            const newplaceIds = Array.from(column.placeIds);
            newplaceIds.splice(source.index, 1);
            newplaceIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                placeIds: newplaceIds,
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

    clickHandler = async () => {
        console.log('hello');

        // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
        // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"
        const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        const place = this.state.place;
        const type = this.state.type;
        console.log(googlePlacesApi);

        // let response = await fetch(`/place/textsearch/json?query=${type}+${place}&key=${googlePlacesApi}`)
        // let data = await response.json()

        // console.log(data.results.length);

        // var placesFetched = {};
        // var placeIds = [];
        
        // for (var i = 0; i < data.results.length; i++) {

        //     //object structure of place card is set here

        //     var placeObject = {};
        //     placeObject['id'] = `place-${i}`;
        //     placeObject['content'] = data.results[i].name;
        //     placeObject['rating'] = data.results[i].rating;
        //     placeObject['photoRef'] = data.results[i].photos[0].photo_reference;
        //     console.log(placeObject);
        //     placeIds.push(`place-${i}`);
        //     placesFetched[`place-${i}`] = placeObject;

            
        //     //try requesting photo
        //     // /place/photo?maxwidth=400&photoreference=&key=YOUR_API_KEY
        //     // let imgResponse = await fetch(`/place/photo?maxwidth=1600&photoreference=${photoReference}&key=${googlePlacesApi}`)
        //     // console.log(imgResponse);
        
        
        // }
        

        // const newState1 = {
        //     ...this.state,
        //     places: placesFetched,
        //     columns: {
        //         ...this.state.columns,
        //         'data-1': {
        //             ...this.state.columns['data-1'],
        //             placeIds: placeIds

        //         }
        //     }
        // }

        // this.setState(newState1);


        fetch(`/place/textsearch/json?query=${type}+${place}&key=${googlePlacesApi}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.results)

                var placesFetched = {};
                var placeIds = [];
                
                for (var i = 0; i < data.results.length; i++) {

                    //object structure of place card is set here

                    var placeObject = {};
                    placeObject['id'] = `place-${i}`;
                    placeObject['content'] = data.results[i].name;
                    placeObject['rating'] = data.results[i].rating;
                    placeObject['photoRef'] = data.results[i].photos ? data.results[i].photos[0].photo_reference : "0";
                    console.log(placeObject);
                    placeIds.push(`place-${i}`);
                    placesFetched[`place-${i}`] = placeObject;
                
                }
                
                const newState = {
                    ...this.state,
                    places: placesFetched,
                    columns: {
                        ...this.state.columns,
                        'data-1': {
                            ...this.state.columns['data-1'],
                            placeIds: placeIds

                        }
                    }
                }

                this.setState(newState);
            })
            .catch(error => console.error(error))

        //setting number of columns

        const columnsCount = this.state.number;

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
                <div>
                    <select className="select-css" id='type' value={this.state.type} onChange={this.changeHandler}>
                        <option value="Restaurants">Restaurants</option>
                        <option value="Hotels">Hotels</option>
                        <option value="Tourist+attraction">Tourist+attraction</option>
                    </select>
                    <input id='place' placeholder='City' type="text" value={this.state.place} onChange={this.changeHandler}/>
                    <input id='number' placeholder='No. of Days' type="text" value={this.state.number} onChange={this.changeHandler}/>
                    <button type='submit' onClick={this.clickHandler}>Submit</button>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className='container'>
                        {this.state.columnOrder.map(columnId => {
                            const column = this.state.columns[columnId];
                            const places = column.placeIds.map(placeId => 
                                this.state.places[placeId]
                            );

                            return <Column key={column.id} column={column} places={places}/>
                        })}
                    </div>
                    <div className='container'>
                        {this.state.dataColumn.map(columnId => {
                            const column = this.state.columns[columnId];
                            const places = column.placeIds.map(placeId => 
                                this.state.places[placeId]
                            );

                            return <Column key={column.id} column={column} places={places}/>
                        })}
                    </div>
                </DragDropContext>
            </div>
            
        );
    }
}

export default Board;