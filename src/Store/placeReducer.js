export const placeReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_PLACES':
            const { compiledData, days, location } = action.search;
            const newState = loadPlaces(state, compiledData, days, location);
            return newState;
        case 'CHANGE_ORDER':
            const { newOrder } = action.order;
            return newOrder;
        case 'HOVER_COLOR':
            const { newColor } = action.color;
            return newColor;
        default:
            return state;
    }
}

const loadPlaces = (state, compiledData, days, location) => {

    let columns = {};
    let dayBoards = [];
    let placeBoards = [];

    for (var i = 0; i < days; i++) {
        var dataObject = {};
        dataObject['id'] = `column-${i}`;
        dataObject['title'] = `Day ${i + 1}`;
        dataObject['placeIds'] = [];

        columns[`column-${i}`] = dataObject;
        dayBoards.push(`column-${i}`);
    }

    let placesFetched = {};
    const placeTypes = ['Restaurants', "Hotels", "Tourist+attraction"];
    
    for (var c = 0; c < compiledData.length; c++){

        let data = compiledData[c];
        let placeIds = [];

        for (var j = 0; j < data.results.length; j++) {

            //object structure of place card is set here
    
            var placeObject = {};
            placeObject['id'] = `place-${placeTypes[c]}-${j}`;
            placeObject['content'] = data.results[j].name;
            placeObject['rating'] = data.results[j].rating;
            placeObject['photoRef'] = data.results[j].photos ? data.results[j].photos[0].photo_reference : "0";
            placeObject['location'] = data.results[j].geometry.location;
            
            //console.log(placeObject);
            placeIds.push(`place-${placeTypes[c]}-${j}`);
            placesFetched[`place-${placeTypes[c]}-${j}`] = placeObject;
        
        }
    
        columns[`data-${c+1}`] = {
            id: `data-${c+1}`,
            title: `${placeTypes[c]}`,
            placeIds: placeIds
        }

        placeBoards.push(`data-${c+1}`);

    } 
    
    const newState = {
        ...state,
        location: location,
        places: placesFetched,
        columns: {
            ...state.columns,
            ...columns,
        },
        dayBoards: [...dayBoards],
        placeBoards: [...placeBoards],
    }

    // console.log(newState);
    return newState;
}