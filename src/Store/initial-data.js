const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Cook'},
        'task-2': { id: 'task-2', content: 'Eat'},
        'task-3': { id: 'task-3', content: 'Digest'},
        'task-4': { id: 'task-4', content: 'Fart'},
    },
    number: 0,
    columns: {
        'data-1': {
            id: 'data-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [],
        },
    },
    dataColumn: ['data-1'],
    columnOrder: ['column-2', 'column-3'],
}

export default initialData;