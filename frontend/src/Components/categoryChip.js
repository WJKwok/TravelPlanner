import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5)
  }
}));

function CategoryChip({ data, toggleClick }) {
  const classes = useStyles();

  return (
    <Chip
      icon={data.icon}
      label={data.label}
      variant={data.clicked ? "default" : "outlined"}
      onClick={() => toggleClick(data)}
      className={classes.chip}
    />
  );
}

export default CategoryChip;
