import moment from 'moment';

export const spotReducer = (state, action) => {
    switch (action.type) {
        case 'CLEAR_STATE':
            const defaultState = clearState()
            return defaultState
        case 'LOAD_TRIP':
            const {trip} = action.payload
            const tripLoaded = loadTrip(trip)
            return tripLoaded
        case 'ADD_SPOTS':
            const {newSpots} = action.payload
            console.log('newSpots: ', newSpots);
            const newSpotsAdded = addNewSpots(state, newSpots)
            console.log('newSpotsAdded: ', newSpotsAdded)
            return newSpotsAdded;
        case 'ADD_SEARCH_ITEM':
            const {newSearchItem} = action.payload
            const newSearchAdded = addSearchItem(state, newSearchItem)
            console.log("newSearchitemstate: ",newSearchAdded)
            return newSearchAdded;
        case 'REORDER':
            const {newOrder} = action.payload
            console.log('Reordered: ', newOrder);
            return newOrder
        case 'CHANGE_DATE':
            const {startDate, numberOfDays} = action.payload
            const newDate = changeDateAndDays(state, startDate, numberOfDays)
            console.log('Date Changed: ', newDate)
            return newDate
        default:
            return state;
    }
}

const clearState = () => {
    const newState = {
        spots: {},
        startDate: moment().startOf('date'),
        numberOfDays: 1,
        destination: 'Berlin',
        columns:{
            'filtered-spots': {
                id: 'filtered-spots',
                title: 'filtered-spots',
                spotIds: []
            },
            'day1': {
                id: 'day1',
                title: 'day1',
                spotIds: []
            },
        },
        filteredBoard: ['filtered-spots'],
        dayBoard:['day1']
    }

    return newState
}

const loadTrip = (trip) => {

    const spots = {}
    trip.spotsArray.forEach(spot => {
        spots[spot.id] = spot
    });

    const columns = {}
    const dayBoard = []
    columns['filtered-spots'] = {
        id: 'filtered-spots',
        title: 'filtered-spots',
        spotIds: trip.filteredSpots
    }

    for (let i = 0; i < trip.dayLists.length; i++){
        const day = `day${i+1}`
        dayBoard.push(day)
        columns[day] = {
            id: day,
            title: day,
            spotIds: trip.dayLists[i]
        }
    }

    const newState = {
        spots,
        startDate: moment(trip.startDate),
        numberOfDays: trip.dayLists.length,
        destination: 'Berlin',
        columns,
        filteredBoard: ['filtered-spots'],
        dayBoard,
        categoriesInTrip: trip.categoriesInTrip
    }

    console.log('load trip state: ', newState)
    return newState
}

const addNewSpots = (state, newSpots) => {
    let mappedSpots = {}
    let spotIds = []
    for (var i = 0; i < newSpots.length; i ++){
        console.log(newSpots[i])
        mappedSpots[newSpots[i].id] = newSpots[i];
        spotIds.push(newSpots[i].id)
    }

    const newState = {
        ...state,
        spots: {
            ...state.spots,
            ...mappedSpots
        },
        columns: {
            ...state.columns,
            'filtered-spots': {
                ...state.columns['filtered-spots'],
                spotIds: [...state.columns['filtered-spots'].spotIds, ...spotIds]
            }
        }
    }

    return newState;
}

const addSearchItem = (state, newSearchItem) => {
    const searchItem = {}
    const itemId = newSearchItem.id;
    searchItem[itemId] = newSearchItem
    const newState = {
        ...state,
        spots: {
            ...state.spots,
            ...searchItem,
        },
        columns: {
            ...state.columns,
            'filtered-spots':{
                ...state.columns['filtered-spots'],
                spotIds: [...state.columns['filtered-spots'].spotIds, itemId]
            }
        }
    }

    return newState;
}

const changeDateAndDays = (state, startDate, numberOfDays) =>{
    console.log('date changing (startDate):', startDate)
    console.log('date changing (numberOfDays):', numberOfDays)
    const previousNumberOfDays = state.numberOfDays;
    
    const dayBoard = []
    for (var i = 0; i < numberOfDays; i ++){
        const title = `day${i+1}`
        dayBoard.push(title);
    }

    if (previousNumberOfDays > numberOfDays) {

        let disposedSpotIds = []

        for (var d = previousNumberOfDays; d > numberOfDays; d --){
            const dayKey = `day${d}`
            disposedSpotIds = disposedSpotIds.concat(state.columns[dayKey].spotIds);
            delete state.columns[dayKey]
        }

        const newState = {
            ...state,
            startDate,
            numberOfDays,
            columns: {
                ...state.columns,
                'filtered-spots': {
                    ...state.columns['filtered-spots'],
                    spotIds: [...state.columns['filtered-spots'].spotIds, ...disposedSpotIds]
                }
            },
            dayBoard
        }

        return newState

    } else if (previousNumberOfDays < numberOfDays) {
        //loop up from previousNumberOfDays to previousNumberOfDays+differenceInDays and add columns
        let newDayBoardObjects = {}
        for (var a = previousNumberOfDays + 1; a <= numberOfDays; a ++){
            newDayBoardObjects[`day${a}`] = {
                id: `day${a}`,
                title: `day${a}`,
                spotIds: []
            }
        }
        
        const newState = {
            ...state,
            startDate,
            numberOfDays,
            dayBoard,
            columns:{
                ...state.columns,
                ...newDayBoardObjects
            }
        }
        return newState
    } else {
        const newState = {
            ...state,
            startDate,
        }
        return newState
    }
}