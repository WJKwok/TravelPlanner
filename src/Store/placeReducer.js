export const placeReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_PLACES':
            const { compiledData, days, location } = action.search;
            const placesLoaded = loadPlaces(state, compiledData, days, location);
            return placesLoaded;
        case 'ADD_EXTRA_DAY':
            const extraDay = addExtraDay(state);
            return extraDay;
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

const addExtraDay = (state) => {

    const nextColumnIndex = state.dayBoards.length;
    const nextColumn = {
        id: `day-${nextColumnIndex}`, 
        title: `Day ${nextColumnIndex + 1}`, 
        placeIds: []
    }

    const newState = {
        ...state,
        days: nextColumnIndex + 1,
        columns: {
            ...state.columns,
            [`day-${nextColumnIndex}`]: nextColumn
        },
        dayBoards: [...state.dayBoards, `day-${nextColumnIndex}`],
    }

    console.log(newState);
    return newState
}

const loadPlaces = (state, compiledData, days, location) => {

    let columns = {};
    let dayBoards = [];
    let categoryBoards = [];

    for (var i = 0; i < days; i++) {
        var dataObject = {};
        dataObject['id'] = `day-${i}`;
        dataObject['title'] = `Day ${i + 1}`;
        dataObject['placeIds'] = [];

        columns[`day-${i}`] = dataObject;
        dayBoards.push(`day-${i}`);
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
    
        columns[`category-${c+1}`] = {
            id: `category-${c+1}`,
            title: `${placeTypes[c]}`,
            placeIds: placeIds
        }

        categoryBoards.push(`category-${c+1}`);

    } 
    
    const newState = {
        ...state,
        days: days,
        location: location,
        places: placesFetched,
        columns: {
            ...state.columns,
            ...columns,
        },
        dayBoards: [...dayBoards],
        categoryBoards: [...categoryBoards],
    }

    // console.log(newState);
    return newState;
}