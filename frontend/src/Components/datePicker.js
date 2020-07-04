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
    const {dispatch} = useContext(SpotContext)

    const classes = useStyles()
    const [now, setNow] = useState(moment().startOf('date'))
    const [startDate, setStartDate] = useState(moment().startOf('date'))
    const [endDate, setEndDate] = useState(moment())
    

    useEffect(()=> {
        const numberOfDays = endDate.diff(startDate, 'days') + 1;
        dispatch({ type: 'CHANGE_DATE', payload:{startDate, numberOfDays}})
    }, [startDate, endDate])

    const startDateHandler = date => {
        const newDate = date.startOf('date')
        if (newDate.isSameOrAfter(now)){
            setStartDate(newDate);
            if(newDate.isAfter(endDate)){
                setEndDate(newDate);
            }
        }
    }

    const endDateHandler = date => {
        const newDate = date.startOf('date')
        if (newDate.isSameOrAfter(startDate)){
            setEndDate(newDate);
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
                disablePast='true'
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