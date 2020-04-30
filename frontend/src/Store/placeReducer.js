import initialData from './initial-data';

export const placeReducer = (state, action) => {
    switch (action.type) {
        case 'CLEAR_STATE':
            console.log('clearing state...')
            console.log('cleared state: ', initialData)
            const clearedState = clearState()
            //WHY can't i return initialData?
            //return initialData
            return clearedState;
        case 'LOAD_EMPTY_DAYS':
            console.log('before dayboards loaded places length: ', Object.keys(state.places).length)
            const { numberOfDays, city } = action.payload
            const emptyDaysLoaded = loadEmptyDays(state, numberOfDays, city)
            console.log('dayboards loaded places length: ', Object.keys(emptyDaysLoaded.places).length)
            return emptyDaysLoaded
        case 'LOAD_DAY_ITINERARY':
            const { day, placeIds, dayPlacesFetched } = action.payload
            const dayItineraryLoaded = loadDayItinerary(state, day, placeIds, dayPlacesFetched)
            return dayItineraryLoaded
        case 'LOAD_ENTIRE_ITINERARY':
            const { itinerary, placesFetched } = action.payload
            const itineraryLoaded = loadEntireItinerary(state, itinerary, placesFetched)
            return itineraryLoaded
        // Load empty category to give it a skeleton, else if you drag without everything having loaded it will cause issue
        case 'LOAD_EMPTY_CATEGORY':
            const { categories } = action.payload
            const emptyCategoriesLoaded = loadEmptyCategories(state, categories)
            console.log("emptyCategoriesLoaded:", emptyCategoriesLoaded)
            return emptyCategoriesLoaded
        case 'LOAD_CATEGORY':
            const { extraSuggestions, placeType} = action.payload
            const categoryLoaded = loadCategory(state, extraSuggestions, placeType)
            return categoryLoaded;
        case 'ADD_SEARCH_ITEM':
            const { placeObject } = action.payload
            const addedItem = addItem(state, placeObject)
            console.log('reducer: ', addedItem);
            return addedItem;
        case 'ADD_EXTRA_DAY':
            const extraDay = addExtraDay(state);
            return extraDay;
        case 'CHANGE_ORDER':
            const { newOrder } = action.order;
            return newOrder;
        default:
            return state;
    }
}

const clearState = () => {
    const newState = {
        itineraryId: "",
        places: {},
        days: 0,
        location: "Berlin",
        columns: {
            'searched-items': {
                id:'searched-items',
                title: 'Searched Items',
                placeIds: []
            }
        },
        categoryBoards: [],
        dayBoards: [],
        searchBoard: ['searched-items']
    }

    return newState;
}

const addItem = (state, placeObject) => {
    const newState = {
        ...state,
        places: {
            ...state.places,
            [placeObject.id]: placeObject
        },
        columns: {
            ...state.columns,
            'searched-items': {
                ...state.columns['searched-items'],
                placeIds: [...state.columns['searched-items'].placeIds, placeObject.id]
            }
        }
    }

    return newState
}

const loadEmptyDays = (state, numberOfDays, city) => {
    let columns = {};
    let dayBoards = [];

    for (var i = 0; i < numberOfDays; i++) {
        let dayObject = {};
        dayObject['id'] = `day-${i}`;
        dayObject['title'] = `Day ${i + 1}`;
        dayObject['placeIds'] = [];

        columns[`day-${i}`] = dayObject;
        dayBoards.push(`day-${i}`);
    }

    const newState = {
        ...state,
        days: numberOfDays,
        location: city,
        columns: {
            ...state.columns,
            ...columns,
        },
        dayBoards: [...dayBoards],
    }

    return newState
}

const loadDayItinerary = (state, day, placeIds, placesFetched) => {

    let dayColumn = state.columns[`day-${day}`];
    dayColumn.placeIds = placeIds

    const newState = {
        ...state,
        places: {
            ...state.places,
            ...placesFetched
        },
        columns: {
            ...state.columns,
            dayColumn,
        },
    }

    return newState
}

const loadEntireItinerary = (state, itinerary, placesFetched) => {

    let columns = {};
    let dayBoards = [];

    const dayPlans = itinerary.dayPlans;

    for (var i = 0; i < dayPlans.length; i++) {
        let dayObject = {};
        dayObject['id'] = `day-${i}`;
        dayObject['title'] = `Day ${i + 1}`;
        dayObject['placeIds'] = [];

        columns[`day-${i}`] = dayObject;
        dayBoards.push(`day-${i}`);
    }

    for(var i = 0; i < dayPlans.length; i++) {
        const placeIds = dayPlans[i].placeIds
        columns[`day-${i}`].placeIds = placeIds
    }

    const newState = {
        ...state,
        itineraryId: itinerary.id,
        places: placesFetched,
        columns: {
            ...state.columns,
            ...columns,
        },
    }

    return newState
}

const loadEmptyCategories = (state, categories) => {
    let columns = {};
    let categoryBoards = [];

    for (var i = 0; i < categories.length; i++) {
        let categoryObject = {};
        categoryObject['id'] = `category-${categories[i]}`;
        categoryObject['title'] = `${categories[i]}`;
        categoryObject['placeIds'] = [];

        columns[`category-${categories[i]}`] = categoryObject;
        categoryBoards.push(`category-${categories[i]}`)
    }

    const newState = {
        ...state,
        columns: {
            ...state.columns,
            ...columns,
        },
        categoryBoards: categoryBoards,
    }

    return newState
}

const loadCategory = (state, extraSuggestions, placeType) => {

    //console.log('hello from reducer: ', extraSuggestions)
    let placesFetched = {}
    let newColumn = {};

    let data = extraSuggestions;
    let placeIds = [];

    console.log("check data result length: ", data.results)

    for (var j = 0; j < data.results.length; j++) {

        //remove duplicate data from category boards
        if(data.results[j].place_id in placesFetched){
            continue;
        }

        var placeObject = {};
        placeObject['id'] = data.results[j].place_id;
        placeObject['content'] = data.results[j].name;
        placeObject['rating'] = data.results[j].rating;
        placeObject['photoRef'] = data.results[j].photos ? data.results[j].photos[0].photo_reference : "0";
        placeObject['location'] = data.results[j].geometry.location;
        
        //console.log(placeObject);
        placeIds.push(data.results[j].place_id);
        placesFetched[data.results[j].place_id] = placeObject;
    
    }
    
    newColumn[`category-${placeType}`] = {
        id: `category-${placeType}`,
        title: `${placeType}`,
        placeIds: placeIds
    }


    const newState = {
        ...state,
        places: {
            ...state.places,
            ...placesFetched
        },
        columns: {
            ...state.columns,
            ...newColumn,
        },
    }

    console.log(newState)
    return newState;
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
