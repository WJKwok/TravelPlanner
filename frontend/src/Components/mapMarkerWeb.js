import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { iconDict } from './spotIcons';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
	emoji: (props) => ({
		position: 'absolute',
		transform: 'translate(-0%, -100%)',
		backgroundColor: props.shouldHighlight ? 'black' : 'white',
		border: `solid 2px ${props.shouldHighlight ? 'white' : 'black'}`,
		lineHeight: 1,
		borderRadius: '50%',
		padding: 5,
		fontSize: 22,
	}),
	heartEmoji: {
		position: 'absolute',
		bottom: '50%',
		left: '60%',
	},
}));

export const MapMarker = ({
	id,
	text,
	category,
	onClick,
	mouseOverId,
	clickedCardId,
	liked,
}) => {
	const styleProps = {
		shouldHighlight: mouseOverId === id || clickedCardId === id,
	};
	const classes = useStyles(styleProps);
	const icon = iconDict[category] ? iconDict[category] : iconDict.Default;

	return (
		<div className={classes.emoji} onClick={onClick}>
			{icon}
			{liked && (
				<FavoriteIcon
					color="error"
					className={classes.heartEmoji}
					data-testid="filled-heart"
				/>
			)}
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
