import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		overflowX: 'auto',
		alignItems: 'flex-start',
		padding: '20px 10px',
		border: 'solid 1px black',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	chip: {
		border: 'solid 1px black',
		padding: 5,
	},
}));

export const CategoryDragAndDrop = ({
	guideCategories,
	orderedCategories,
	onOrderChange,
}) => {
	console.log('CategoryDragAndDrop rendered');
	const classes = useStyles();
	const [state, setState] = useState({
		columns: {
			'category-chips': {
				id: 'category-chips',
				title: 'category-chips',
				categories: guideCategories,
			},
			'ordered-chips': {
				id: 'ordered-chips',
				title: 'ordered-chips',
				categories: orderedCategories,
			},
		},
	});

	useEffect(() => {
		const cleanGuideCategories = guideCategories.filter(
			(el) => !orderedCategories.includes(el)
		);
		setState({
			columns: {
				'category-chips': {
					id: 'category-chips',
					title: 'category-chips',
					categories: cleanGuideCategories,
				},
				'ordered-chips': {
					id: 'ordered-chips',
					title: 'ordered-chips',
					categories: orderedCategories,
				},
			},
		});
	}, [guideCategories, orderedCategories]);

	useEffect(() => {
		const e = {
			target: {
				name: 'categories',
				value: state.columns['ordered-chips'].categories,
			},
		};
		onOrderChange(e);
		//onOrderChange(state.columns['ordered-chips'].categories);
	}, [state]);

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		const start = state.columns[source.droppableId];
		const finish = state.columns[destination.droppableId];

		//if moving within the same column
		if (start === finish) {
			const column = state.columns[source.droppableId];
			const newCategories = Array.from(column.categories);
			newCategories.splice(source.index, 1);
			newCategories.splice(destination.index, 0, draggableId);

			const newColumn = {
				...column,
				categories: newCategories,
			};

			const newOrder = {
				...state,
				columns: {
					...state.columns,
					[newColumn.id]: newColumn,
				},
			};
			setState(newOrder);
			return;
		}

		//moving from one list to another

		let startCategories = Array.from(start.categories);
		startCategories = startCategories.filter((el) => el != draggableId);
		const newStart = {
			...start,
			categories: startCategories,
		};

		const finishCategories = Array.from(finish.categories);
		finishCategories.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			categories: finishCategories,
		};

		const newOrder = {
			...state,
			columns: {
				...state.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish,
			},
		};

		setState(newOrder);
		// console.log('moving to a different columns', newOrder);
		// dispatch({ type: 'REORDER', payload: { newOrder } });
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="category-chips" direction="horizontal">
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.root}
					>
						{state.columns['category-chips'].categories.map((item, index) => (
							<Draggable key={item} draggableId={item} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										className={classes.chip}
									>
										{item}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<Droppable droppableId="ordered-chips" direction="horizontal">
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.root}
					>
						{state.columns['ordered-chips'].categories.map((item, index) => (
							<Draggable key={item} draggableId={item} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										className={classes.chip}
									>
										{item}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};
