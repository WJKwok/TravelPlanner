import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
	formControl: {
		minWidth: 170,
		margin: '15px 0px 0px 10px',
	},
});

function DaySelectMenu({ day, dayChangeHandler }) {
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

export default DaySelectMenu;
