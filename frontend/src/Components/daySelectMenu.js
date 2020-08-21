import React, {useState} from 'react'

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
    formControl: {
      minWidth: 170,
      backgroundColor: '#e8e8e8',
      border: '5px solid #e8e8e8',
      borderRadius: '10px 10px 0px 0px'
    },
});

function DaySelectMenu({day, dayChangeHandler}) {

    const classes = useStyles();

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    return (
        <FormControl className={classes.formControl}>
          <InputLabel>Show opening hours for</InputLabel>
          <Select
            value={day}
            onChange={(e) => dayChangeHandler(e.target.value)}
          >
            {daysOfWeek.map((day, index) => 
              <MenuItem value={index}>{day}</MenuItem>
            )}
          </Select>
        </FormControl>
    );
}

export default DaySelectMenu;