import moment from 'moment';

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

//Object.freeze({})