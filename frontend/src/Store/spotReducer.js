export const spotReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_SPOTS':
            const {newSpots} = action.payload
            console.log('newSpots: ', newSpots);
            const newSpotsAdded = addNewSpots(state, newSpots)
            console.log('newSpotsAdded: ', newSpotsAdded)
            return newSpotsAdded;
        case 'REORDER':
            const {newOrder} = action.payload
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

const addNewSpots = (state, newSpots) => {
    console.log('is it here??: ', newSpots)
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

const changeDateAndDays = (state, startDate, numberOfDays) =>{

    const previousNumberOfDays = state.numberOfDays;
    const differenceInDays = Math.abs(numberOfDays - previousNumberOfDays)
    
    const dayBoard = []
    for (var i = 0; i < numberOfDays; i ++){
        const title = `day${i+1}`
        dayBoard.push(title);
    }

    if (previousNumberOfDays > numberOfDays) {
        //loop down previousNumberOfDays by differenceInDays and remove keys

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
    }

    return state
}