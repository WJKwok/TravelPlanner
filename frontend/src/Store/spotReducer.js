export const spotReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_SPOTS':
            const {newSpots}  = action.payload
            console.log('newSpots: ', newSpots);
            const newSpotsAdded = addNewSpots(state, newSpots)
            console.log('newSpotsAdded: ', newSpotsAdded)
            return newSpotsAdded;
        case 'REORDER':
            const {newOrder} = action.payload
            return newOrder
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

