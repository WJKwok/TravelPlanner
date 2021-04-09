import moment from 'moment';

export const initialData = {
	spots: {},
	startDate: moment().startOf('date'),
	numberOfDays: 1,
	columns: {
		'filtered-spots': {
			id: 'filtered-spots',
			title: 'filtered-spots',
			spotIds: [],
		},
		day1: {
			id: 'day1',
			title: 'day1',
			spotIds: [],
		},
	},
	filteredBoard: ['filtered-spots'],
	dayBoard: ['day1'],
	guide: undefined,
	clickedCategories: [],
	queriedCategories: [],
	spotToHighlightID: '',
	unsavedChanges: false,
};
