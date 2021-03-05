import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { iconDict } from './spotIcons';

const useStyles = makeStyles((theme) => ({
	pin: {
		display: 'flex',
		position: 'absolute',
		transform: 'translate(-0%, -100%)',
	},
	emoji: {
		backgroundColor: 'white',
		lineHeight: 1,
		paddingTop: 2,
		borderRadius: '10px 0px 0px 0px',
		border: 'solid 2px #e15915',
		fontSize: 22,
	},
	index: {
		backgroundColor: '#e15915',
		lineHeight: 1,
		padding: '5px 5px',
		color: 'white',
		borderRadius: '0px 10px 10px 0px',
		fontSize: 16,
	},
	scaleUp: {
		transform: 'scale(1.3)',
		zIndex: 1,
	},
}));

export const MapMarker = ({ id, text, category, onClick, mouseOverId }) => {
	const classes = useStyles();
	const icon = iconDict[category] ? iconDict[category] : iconDict.Default;

	return (
		<div
			className={`${classes.pin} ${mouseOverId === id ? classes.scaleUp : ''}`}
			onClick={onClick}
		>
			<div className={classes.emoji}>{icon}</div>
			<div className={classes.index}>{text}</div>
		</div>
	);
};

/* previously using badge 
    <Badge
        badgeContent={icon}
        onClick={() => pinClicked(index, id)}
        
        //overriding classes use 'classes={{componenetNameToOverride: class}}'
        classes={{
            badge: classes[category] ? classes[category] : classes.Default,
        }}
        className={mouseOverCard === id ? mapClass.marker : null}
    >
        {icon}
    </Badge>

	this is pure ccs pointy arrow
	position: 'relative'
	'&::after': {
		content: '""', //content attribute needed to be double quoted like this
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		margin: '0 auto',
		width: 0,
		height: 0,
		borderTop: 'solid 5px white',
		borderLeft: 'solid 3px transparent',
		borderRight: 'solid 3px transparent',
	},
*/
