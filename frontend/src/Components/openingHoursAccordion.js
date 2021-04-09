import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginBottom: '1em',
	},
	summaryContent: {
		display: 'flex',
	},
	hoursRow: {
		display: 'flex',
		whiteSpace: 'pre-wrap',
	},
	icon: {
		marginRight: 20,
	},
	table: {
		paddingLeft: 40,
	},
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

	return openingHours ? (
		<div className={classes.root}>
			<div className={classes.summaryContent}>
				<ScheduleIcon className={classes.icon} />
				<p>
					{expanded
						? 'Opening Hours:'
						: `Today: ${openingHours[0].split(': ')[1]}`}
				</p>

				<ExpandMoreIcon
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})}
					onClick={handleExpandClick}
				/>
			</div>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<BasicTable openingHours={openingHours} />
			</Collapse>
		</div>
	) : null;
};
