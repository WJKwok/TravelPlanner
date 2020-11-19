import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
	chip: {
		margin: theme.spacing(0.5),
	},
}));

type Props = {
	data: {
		key: string;
		label: string;
		icon: JSX.Element;
		clicked: boolean;
	};
	toggleChip: (data: object) => void;
};

function CategoryChip({ data, toggleChip }: Props) {
	const classes = useStyles();

	return (
		<Chip
			data-testid={`${data.label}-chip-${
				data.clicked ? 'clicked' : 'notClicked'
			}`}
			icon={data.icon}
			label={data.label}
			variant={data.clicked ? 'default' : 'outlined'}
			onClick={() => toggleChip(data)}
			className={classes.chip}
		/>
	);
}

export default CategoryChip;
