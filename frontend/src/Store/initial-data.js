export const initialData = {
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

export const initialDataTest = {
    spots: {},
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
        'day2': {
            id: 'day2',
            title: 'day2',
            spotIds: []
        }
    },
    filteredBoard: ['filtered-spots'],
    dayBoard:['day1', 'day2']
}

//Object.freeze({})