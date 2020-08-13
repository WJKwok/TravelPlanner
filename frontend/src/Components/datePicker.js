import React, {useState, useEffect, useContext} from "react";
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";

import {SpotContext} from '../Store/SpotContext'

/* custom style for disabled property
https://stackoverflow.com/questions/58540364/material-ui-overide-disabled-styles-for-inputbase
*/

/*textfield on click opens popover
https://stackoverflow.com/questions/58540364/material-ui-overide-disabled-styles-for-inputbase
*/

const useStyles = makeStyles({
    datePicker: {
        marginRight: 5,
        "& .Mui-disabled": {
            color: 'black',
            backgroundColor: 'transparent'
        }
    },
    inputRoot: {
        color: 'red',
    },
})

function DatePicker() {
    const {dispatch, spotState} = useContext(SpotContext)

    const classes = useStyles()
    const now = moment().startOf('date')
    const startDate = spotState.startDate
    const endDate = spotState.startDate.clone().add(spotState.numberOfDays - 1, 'days')
    const currentTripLength = spotState.numberOfDays
    const tripLengthLimit = 7

    // useEffect(()=> {
    //     console.log('date changed: ', startDate, endDate)
    //     const numberOfDays = endDate.diff(startDate, 'days') + 1;
    //     dispatch({ type: 'CHANGE_DATE', payload:{startDate, numberOfDays}})
    // }, [startDate, endDate])

    const startDateHandler = date => {
        const newStartDate = date.startOf('date')
        const numberOfDays = endDate.diff(newStartDate, 'days') + 1

        if (newStartDate.isBefore(endDate) && numberOfDays < tripLengthLimit){
            console.log('start < end & dayDiff < tripLengthLimit')
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newStartDate, numberOfDays: numberOfDays}})
        }

        if (newStartDate.isBefore(endDate) && numberOfDays > tripLengthLimit){
            console.log('start < end & dayDiff > tripLengthLimit')
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newStartDate, numberOfDays: tripLengthLimit}})
        }

        if (newStartDate.isAfter(endDate)){
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newStartDate, numberOfDays: currentTripLength}})
        }

        if (newStartDate.isSame(endDate)){
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newStartDate, numberOfDays: 1}})
        }

    }

    const endDateHandler = date => {
        const newEndDate = date.startOf('date')

        if (newEndDate.isSameOrAfter(startDate)){
            // setEndDate(newEndDate);
            const numberOfDays = newEndDate.diff(startDate, 'days') + 1;
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: startDate, numberOfDays}})
        }
    }

    const TextFieldComponent = (props) => {
        return <TextField {...props} disabled={true} />
    }

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
                className={classes.datePicker}
                disableToolbar
                // disablePast='true'
                inputVariant="outlined"
                variant="inline"
                format="DD MMM YYYY"
                margin="normal"
                id="start"
                label="Start Date"
                value={startDate}
                autoOk={true}
                onChange={startDateHandler}
                TextFieldComponent={TextFieldComponent}
                KeyboardButtonProps={{
                "aria-label": "change date"
                }}
            />
            <KeyboardDatePicker
                className={classes.datePicker}
                disableToolbar
                inputVariant="outlined"
                variant="inline"
                format="DD MMM YYYY"
                margin="normal"
                id="end"
                label="End Date"
                minDate={startDate}
                value={endDate}
                autoOk={true}
                onChange={endDateHandler}
                TextFieldComponent={TextFieldComponent}
                KeyboardButtonProps={{
                "aria-label": "change date"
                }}
            />
        </MuiPickersUtilsProvider>
    );
}

export default DatePicker;