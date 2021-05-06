import moment from 'moment';

export const initialData = {
	spots: {},
	startDate: moment().startOf('date'),
	numberOfDays: 2,
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
		day2: {
			id: 'day2',
			title: 'day2',
			spotIds: [],
		},
	},
	filteredBoard: ['filtered-spots'],
	dayBoard: ['day1', 'day2'],
	guide: {
		id: undefined,
		categories: [],
	},
	clickedCategories: [],
	queriedCategories: [],
	spotToHighlightID: '',
	unsavedChanges: false,
	recentLikeToggledSpotId: undefined,
};
