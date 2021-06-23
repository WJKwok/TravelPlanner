import React from 'react';

import clsx from 'clsx';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginBottom: '1em',
	},
	summaryContent: {
		display: 'flex',
	},
	firstLine: {
		marginBottom: 0,
	},
	hoursRow: {
		display: 'flex',
		whiteSpace: 'pre-wrap',
	},
	icon: {
		marginRight: 20,
	},
	table: {},
	tableCell: {
		borderBottom: 'none',
		padding: '5px 0px',
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}));

const BasicTable = ({ openingHours }) => {
	const classes = useStyles();

	const trimDayText = (dayText) => {
		const dayAndHoursArray = dayText.split(': ');
		const trimmedDayText = [
			dayAndHoursArray[0],
			dayAndHoursArray[1].replace(/, /g, '\n'),
		];
		return trimmedDayText;
	};

	const formattedHours = openingHours.map((day) => trimDayText(day));

	return (
		<TableContainer className={classes.table}>
			<Table aria-label="simple table">
				<TableBody>
					{formattedHours.map((day) => (
						<TableRow key={day[0]}>
							<TableCell
								component="th"
								scope="row"
								classes={{ root: classes.tableCell }}
							>
								{day[0]}
							</TableCell>
							<TableCell
								className={classes.hoursRow}
								align="left"
								classes={{ root: classes.tableCell }}
							>{`${day[1]}`}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export const OpeningHoursAccordion = ({ openingHours }) => {
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const day = moment().startOf('date').day();
	const dayIndex = day === 0 ? 6 : day - 1;

	return openingHours && openingHours.length !== 0 ? (
		<div className={classes.root}>
			<div className={classes.summaryContent} onClick={handleExpandClick}>
				{/* <ScheduleIcon className={classes.icon} /> */}
				<p className={classes.firstLine}>
					{expanded
						? 'Opening Hours:'
						: `Today: ${openingHours[dayIndex].split(': ')[1]}`}
				</p>

				<ExpandMoreIcon
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})}
				/>
			</div>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<BasicTable openingHours={openingHours} />
			</Collapse>
		</div>
	) : null;
};
