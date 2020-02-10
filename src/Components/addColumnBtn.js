import React, { Component } from "react";
import initialData from '../Store/initial-data';

class AddColumn extends Component {

    state = initialData;

    clickHandler = () => {
        console.log('hello');
        console.log(this.state);
        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                'column-4': {
                    id: 'column-4',
                    title: 'the end',
                    taskIds: [],
                },
            },
            columnOrder: ['column-2', 'column-3', 'column-4'],
        }

        this.setState(newState);
    }

    render() {
        return(
            <button onClick={this.clickHandler}>Add column</button>
        );
    }
}

export default AddColumn;