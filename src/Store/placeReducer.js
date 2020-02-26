export const placeReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_PLACES':
            const { data, days } = action.search;
            const newState = loadPlaces(state, data, days);
            return newState;
        case 'CHANGE_ORDER':
            const { newOrder } = action.order;
            return newOrder;
        default:
            return state;
    }
}

const loadPlaces = (state, data, days) => {

    var columns = {};
    var columnOrder = [];

    for (var i = 0; i < days; i++) {
        var dataObject = {};
        dataObject['id'] = `column-${i}`;
        dataObject['title'] = `Day ${i + 1}`;
        dataObject['placeIds'] = [];

        columns[`column-${i}`] = dataObject;
        columnOrder.push(`column-${i}`);
    }

    var placesFetched = {};
    var placeIds = [];
    
    for (var j = 0; j < data.results.length; j++) {

        //object structure of place card is set here

        var placeObject = {};
        placeObject['id'] = `place-${j}`;
        placeObject['content'] = data.results[j].name;
        placeObject['rating'] = data.results[j].rating;
        placeObject['photoRef'] = data.results[j].photos ? data.results[j].photos[0].photo_reference : "0";
        placeObject['location'] = data.results[j].geometry.location;
        
        //console.log(placeObject);
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

    // console.log(newState);
    return newState;
}