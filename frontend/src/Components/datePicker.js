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

    // useEffect(()=> {
    //     console.log('date changed: ', startDate, endDate)
    //     const numberOfDays = endDate.diff(startDate, 'days') + 1;
    //     dispatch({ type: 'CHANGE_DATE', payload:{startDate, numberOfDays}})
    // }, [startDate, endDate])

    const startDateHandler = date => {
        const newDate = date.startOf('date')

        if (newDate.isSameOrAfter(now) && newDate.isAfter(endDate)){
            // setStartDate(newDate);
            // setEndDate(newDate);
            console.log('start > end', newDate)
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newDate, numberOfDays: 1}})
            return;
        }

        if (newDate.isSameOrAfter(now)){
            // setStartDate(newDate);
            const numberOfDays = endDate.diff(newDate, 'days') + 1;
            dispatch({ type: 'CHANGE_DATE', payload:{startDate: newDate, numberOfDays}})
            return;
        }
    }

    const endDateHandler = date => {
        const newDate = date.startOf('date')

        if (newDate.isSameOrAfter(startDate)){
            // setEndDate(newDate);
            const numberOfDays = newDate.diff(startDate, 'days') + 1;
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
                minDate={startDate.isBefore(now) ? startDate : now}
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