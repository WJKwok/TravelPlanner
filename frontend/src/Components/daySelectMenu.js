import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
	formControl: {
		width: 170,
		margin: '15px 0px 0px 10px',
	},
});

export function DaySelectMenu({ day, dayChangeHandler }) {
	const classes = useStyles();

	const daysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	return (
		<FormControl className={classes.formControl}>
			<TextField
				data-testid="day-select-menu"
				select
				label="Show opening hours for"
				value={day}
				onChange={(e) => dayChangeHandler(e.target.value)}
				variant="outlined"
				size="small"
			>
				{daysOfWeek.map((day, index) => (
					<MenuItem
						key={index}
						value={index}
						data-testid={`day-select-${daysOfWeek[index]}`}
					>
						{day}
					</MenuItem>
				))}
			</TextField>
		</FormControl>
	);
}
