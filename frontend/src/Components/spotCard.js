import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SpotCardBase } from './spotCardBase';

const SpotCard = React.memo((props) => {
	const { spot, index, dragAndDroppable } = props;

	return (
		<Draggable
			draggableId={spot.id}
			index={index}
			isDragDisabled={!dragAndDroppable}
		>
			{(provided) => <SpotCardBase provided={provided} {...props} />}
		</Draggable>
	);
});

export default SpotCard;
