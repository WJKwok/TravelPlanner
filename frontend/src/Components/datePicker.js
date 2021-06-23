import React, { useState, useEffect, useContext } from 'react';
import { SpotContext } from 'Store';

import moment from 'moment';
import MomentUtils from '@date-io/moment';

import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
	DatePicker as DatePickerUI,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

/* custom style for disabled property
https://stackoverflow.com/questions/58540364/material-ui-overide-disabled-styles-for-inputbase
*/

/*textfield on click opens popover
https://stackoverflow.com/questions/58540364/material-ui-overide-disabled-styles-for-inputbase
*/

const useStyles = makeStyles({
	datePicker: {
		marginRight: 5,
		width: '12ch',
		// "& .Mui-disabled": {
		//     color: 'black',
		//     backgroundColor: 'transparent'
		// }
	},
});

export function DatePicker() {
	const { dispatch, spotState } = useContext(SpotContext);

	const classes = useStyles();
	const now = moment().startOf('date');
	const startDate = spotState.startDate;
	const endDate = spotState.startDate
		.clone()
		.add(spotState.numberOfDays - 1, 'days');
	const currentTripLength = spotState.numberOfDays;
	const tripLengthLimit = 7;

	// useEffect(()=> {
	//     console.log('date changed: ', startDate, endDate)
	//     const numberOfDays = endDate.diff(startDate, 'days') + 1;
	//     dispatch({ type: 'CHANGE_DATE', payload:{startDate, numberOfDays}})
	// }, [startDate, endDate])

	console.log('start date:', startDate);
	const startDateHandler = (date) => {
		const newStartDate = date.startOf('date');
		const numberOfDays = endDate.diff(newStartDate, 'days') + 1;

		if (newStartDate.isBefore(endDate) && numberOfDays < tripLengthLimit) {
			console.log('start < end & dayDiff < tripLengthLimit');
			dispatch({
				type: 'CHANGE_DATE',
				payload: { startDate: newStartDate, numberOfDays: numberOfDays },
			});
		}

		if (newStartDate.isBefore(endDate) && numberOfDays > tripLengthLimit) {
			console.log('start < end & dayDiff > tripLengthLimit');
			dispatch({
				type: 'CHANGE_DATE',
				payload: { startDate: newStartDate, numberOfDays: tripLengthLimit },
			});
		}

		if (newStartDate.isAfter(endDate)) {
			dispatch({
				type: 'CHANGE_DATE',
				payload: { startDate: newStartDate, numberOfDays: currentTripLength },
			});
		}

		if (newStartDate.isSame(endDate)) {
			dispatch({
				type: 'CHANGE_DATE',
				payload: { startDate: newStartDate, numberOfDays: 1 },
			});
		}
	};

	const endDateHandler = (date) => {
		const newEndDate = date.startOf('date');
		const numberOfDays = newEndDate.diff(startDate, 'days') + 1;

		console.log('number of days: ', numberOfDays);

		if (newEndDate.isSameOrAfter(startDate) && numberOfDays > tripLengthLimit) {
			console.log('start < end & dayDiff > tripLengthLimit');
			dispatch({
				type: 'CHANGE_DATE',
				payload: {
					startDate: newEndDate.clone().subtract('days', 7),
					numberOfDays: tripLengthLimit,
				},
			});
		}

		if (
			newEndDate.isSameOrAfter(startDate) &&
			numberOfDays <= tripLengthLimit
		) {
			console.log('start < end & dayDiff <= tripLengthLimit');
			dispatch({
				type: 'CHANGE_DATE',
				payload: { startDate: startDate, numberOfDays },
			});
		}
	};

	const TextFieldComponent = (props) => {
		return <TextField {...props} disabled={true} />;
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<DatePickerUI
				className={classes.datePicker}
				disableToolbar
				inputVariant="outlined"
				format="DD MMM YYYY"
				margin="normal"
				id="startDate"
				label="Start Date"
				value={startDate}
				autoOk={true}
				onChange={startDateHandler}
				size="small"
			/>
			<DatePickerUI
				className={classes.datePicker}
				disableToolbar
				inputVariant="outlined"
				format="DD MMM YYYY"
				margin="normal"
				id="endDate"
				label="End Date"
				minDate={startDate}
				value={endDate}
				autoOk={true}
				onChange={endDateHandler}
				size="small"
			/>
		</MuiPickersUtilsProvider>
	);
}
