import React, { useState, useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ScrapedListItem } from './scrapedListItem';
import { SnackBarContext, SpotContext } from 'Store';
import { reshapeGoogleObject } from 'utils/reshapeGoogleObject';
import { useMutation, gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
	page: {
		margin: '5px',
	},
	circularProgress: {
		height: '25px',
	},
	urlInput: {
		marginBottom: '5px',
		display: 'block',
	},
	iframe: (props) => ({
		borderStyle: 'solid',
		borderWidth: '1px',
		height: '800px',
		visibility: props.areIframeListenersLoaded ? 'visible' : 'hidden',
	}),
	listItems: {
		display: 'flex',
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
}));

export const ListScraper = ({ setListScraperOpen }) => {
	const { dispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const [listURL, setListURL] = useState('');
	const [areIframeListenersLoading, setAreIframeListenersLoading] =
		useState(false);
	const [urlHtml, setUrlHtml] = useState('');

	const iframeref = useRef();
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const titleElRef = useRef(undefined);
	const contentElRef = useRef(undefined);
	const [_, setLastClickedEl] = useState(undefined);
	const [listicleVariable, setListicleVariable] = useState({});

	const [listItems, setListItems] = useState([]);
	const editableListItemsRef = useRef({});

	const areIframeListenersLoaded = !areIframeListenersLoading && isIframeLoaded;
	const styleProps = {
		areIframeListenersLoaded,
	};
	const classes = useStyles(styleProps);

	useEffect(() => {
		if (listURL) {
			setAreIframeListenersLoading(true);
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
					setListicleVariable({});
					setIsIframeLoaded(false);
					titleElRef.current = undefined;
					contentElRef.current = undefined;
				})
				.catch((error) => {
					// TODO: user feedback
					console.error('Fetch failed:', error);
					setAreIframeListenersLoading(false);
				});
		}
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
							//unclick title
							e.target.style.background = '';
							titleElRef.current = undefined;
						} else {
							//click content
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

					//basically used to re-render component, since state is frozen within eventListeners
					setLastClickedEl(e.target);
				});
			});
			setAreIframeListenersLoading(false);
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
					setListicleVariable({
						url: listURL,
						titleSelector: tSelector,
						contentSelector: cSelector,
					});
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

	const [submitListicle] = useMutation(SUBMIT_LISTICLE, {
		onCompleted() {
			console.log('SubmitListicle Success');
		},
		onError(err) {
			console.log(err);
		},
	});

	const addItemsToMap = () => {
		//TODO: checks if editableListItemsRef is not null before adding

		const editedItems = editableListItemsRef.current;
		const reshapedItemsArray = Object.keys(editedItems).reduce(
			(result, key) => {
				if (editedItems[key].googlePlaceData) {
					const searchedItem = editedItems[key].googlePlaceData;
					const reshapedItem = reshapeGoogleObject(searchedItem);
					result.push(reshapedItem);
				}
				return result;
			},
			[]
		);

		dispatch({
			type: 'ADD_SPOTS',
			payload: {
				newSpots: reshapedItemsArray,
				categories: ['Searched'],
			},
		});

		submitListicle({
			variables: listicleVariable,
		});

		setListScraperOpen(false);
		setSnackMessage({ text: 'Added list items to maps!', code: 'Confirm' });
	};

	return (
		<div className={classes.page}>
			{/*TODO: buffer for typing? do people usually copy paste? */}
			<label>
				Copy-paste in listcle URL
				<input
					className={classes.urlInput}
					value={listURL}
					onChange={(e) => setListURL(e.target.value)}
				/>
			</label>
			{areIframeListenersLoading && <CircularProgress size={20} />}
			{/* TODO: indicate if title and content has been chosen, useState counter to register click and rerender to check ref*/}
			{/* TODO: do not show extract when you don't have selectors */}
			{areIframeListenersLoaded && (
				<div>
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
						<button onClick={extractList}>Extract List</button>
					)}
				</div>
			)}
			{listItems.length !== 0 && (
				<div>
					<div className={classes.listItems}>
						{/* TODO: listItems changes, component state doesn't reset - try key change? OR setListItems back to empty */}
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
					<button onClick={addItemsToMap}>Add items to map</button>
				</div>
			)}

			<div className={classes.iframe}>
				{/* TODO: tune out all the network errors within iframe */}
				{urlHtml && (
					<iframe
						ref={iframeref}
						width="100%"
						height="100%"
						srcDoc={urlHtml}
						onLoad={() => setIsIframeLoaded(true)}
					/>
				)}
			</div>
		</div>
	);
};

const SUBMIT_LISTICLE = gql`
	mutation submitListicle(
		$url: String!
		$titleSelector: String!
		$contentSelector: String!
	) {
		submitListicle(
			url: $url
			titleSelector: $titleSelector
			contentSelector: $contentSelector
		) {
			url
			titleSelector
			contentSelector
		}
	}
`;
