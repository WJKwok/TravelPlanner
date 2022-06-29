import React from 'react';

export const SelectionCheckList = ({
	titleElRef,
	contentElRef,
	extractListHandler,
}) => {
	return (
		<div data-testid="list-scraper-text-selection-prompt">
			{titleElRef.current ? (
				<span>Title is selected ✅</span>
			) : (
				<span>Please select one item title in Iframe</span>
			)}
			{contentElRef.current ? (
				<p>Content is selected ✅</p>
			) : (
				<p>Please select one item content in Iframe</p>
			)}
			{titleElRef.current && contentElRef.current && (
				<button data-testid="extract-list-button" onClick={extractListHandler}>
					Extract List
				</button>
			)}
		</div>
	);
};
