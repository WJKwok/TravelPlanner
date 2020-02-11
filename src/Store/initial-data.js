const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Museum'},
        'task-2': { id: 'task-2', content: 'Dinner'},
        'task-3': { id: 'task-3', content: 'Park'},
        'task-4': { id: 'task-4', content: 'Landmark'},
    },
    number: 0,
    columns: {
        'data-1': {
            id: 'data-1',
            title: 'Places',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },
    dataColumn: ['data-1'],
    columnOrder: [],
}

export default initialData;