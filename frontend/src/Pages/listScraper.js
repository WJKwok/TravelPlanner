import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrapedListItem } from 'Components';

const useStyles = makeStyles((theme) => ({
	page: {
		margin: '5px',
	},
	urlInput: {
		marginBottom: '5px',
	},
	iframe: {
		borderStyle: 'solid',
		borderWidth: '1px',
		height: '800px',
	},
	listItems: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
}));

const ListScraper = () => {
	const classes = useStyles();

	const [listURL, setListURL] = useState('');
	const [urlHtml, setUrlHtml] = useState('');

	const iframeref = useRef();
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const titleElRef = useRef(undefined);
	const contentElRef = useRef(undefined);

	const [listItems, setListItems] = useState([]);
	const editableListItemsRef = useRef({});

	useEffect(() => {
		listURL &&
			fetch(
				`https://python-list-scrapper.herokuapp.com/extracthtml/?url=${listURL}`
			)
				.then((response) => response.json())
				.then((data) => {
					const html = decodeURIComponent(
						escape(window.atob(data.encodedHtml))
					);
					setUrlHtml(html);

					// reset iframe state
					setIsIframeLoaded(false);
					titleElRef.current = undefined;
					contentElRef.current = undefined;
				})
				.catch((error) => {
					// TODO: user feedback
					console.error('Fetch failed:', error);
				});
	}, [listURL]);

	useEffect(() => {
		const doc = iframeref.current;

		//https://theculturetrip.com/europe/germany/berlin/articles/berlin-from-the-top-the-5-best-panoramic-views/
		//https://misstourist.com/22-things-to-do-in-berlin-ultimate-bucket-list/

		if (isIframeLoaded) {
			const elements = doc.contentDocument.querySelectorAll('*');
			elements.forEach((element) => {
				element.addEventListener('click', (e) => {
					//prevent bubbling
					e.stopPropagation();
					//prevent page links from opening
					e.preventDefault();

					if (!titleElRef.current && !contentElRef.current) {
						e.target.style.background = 'yellow';
						titleElRef.current = e.target;
					} else if (titleElRef.current && !contentElRef.current) {
						if (titleElRef.current === e.target) {
							e.target.style.background = '';
							titleElRef.current = undefined;
						} else {
							e.target.style.background = 'purple';
							contentElRef.current = e.target;
						}
					} else if (titleElRef.current && contentElRef.current) {
						if (contentElRef.current === e.target) {
							e.target.style.background = '';
							contentElRef.current = undefined;
						} else if (titleElRef.current === e.target) {
							// do nothing
						} else {
							contentElRef.current.style.background = '';
							e.target.style.background = 'purple';
							contentElRef.current = e.target;
						}
					}
				});
			});
		}
	}, [isIframeLoaded]);

	const extractList = () => {
		if (titleElRef.current && contentElRef.current) {
			const { nodeName: tNodeName, className: tClassName } = titleElRef.current;
			const { nodeName: cNodeName, className: cClassName } =
				contentElRef.current;

			const tSelector =
				tNodeName.toLowerCase() +
				(tClassName ? '.' + tClassName.split(' ').join('.') : '');
			const cSelector =
				cNodeName.toLowerCase() +
				(cClassName ? '.' + cClassName.split(' ').join('.') : '');

			console.log(
				'scrapping list with these two selectors:',
				tSelector,
				cSelector
			);

			fetch(
				`https://python-list-scrapper.herokuapp.com/extracthtml/?url=${listURL}&titleSelector=${tSelector}&contentSelector=${cSelector}`
			)
				.then((response) => response.json())
				.then((data) => {
					console.log('list extracted:', data);
					//TODO: rename name to title
					const filteredItems = data.arrayOfDocuments.filter((doc) => doc.name);
					const itemsDict = {};
					//TODO: use id instead of index
					filteredItems.forEach((item, index) => (itemsDict[index] = item));
					editableListItemsRef.current = itemsDict;
					setListItems(filteredItems);
				})
				.catch((error) => {
					console.error('Extract List Error:', error);
				});
		}
	};

	return (
		<div className={classes.page}>
			<input
				className={classes.urlInput}
				value={listURL}
				onChange={(e) => setListURL(e.target.value)}
			/>
			<button onClick={extractList}>Extract List</button>
			<div className={classes.listItems}>
				{listItems &&
					listItems.map((item, idx) => (
						<ScrapedListItem
							key={item.name}
							name={item.name}
							content={item.content}
							index={idx}
							listItemRef={editableListItemsRef}
						/>
					))}
			</div>
			<button onClick={() => console.log(editableListItemsRef.current)}>
				Print List Item ref
			</button>
			<div className={classes.iframe}>
				{/* tune out all the network errors within iframe */}
				<iframe
					ref={iframeref}
					width="100%"
					height="100%"
					srcDoc={urlHtml}
					onLoad={() => setIsIframeLoaded(true)}
				/>
			</div>
		</div>
	);
};

export default ListScraper;
