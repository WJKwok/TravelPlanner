const initialData = {
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

export default initialData;

//Object.freeze({})