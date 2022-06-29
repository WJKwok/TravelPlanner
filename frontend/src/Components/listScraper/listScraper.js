import React, { useState, useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ScrapedListItem } from './scrapedListItem';
import { SnackBarContext, SpotContext } from 'Store';
import { reshapeGoogleObject } from 'utils/reshapeGoogleObject';
import { useMutation, gql } from '@apollo/client';
import { getSelectorsFromElements, areListicleVariablesPresent } from './utils';

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
		marginTop: '15px',
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
	errorMessage: {
		position: 'sticky',
		top: '0',
		background: 'red',
		color: 'white',
		width: '100%',
		textAlign: 'center',
		marginTop: '-13px',
	},
}));

export const ListScraper = ({ setListScraperOpen }) => {
	const { dispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const [listURL, setListURL] = useState('');
	const [urlHtml, setUrlHtml] = useState('');
	const [listicleVariable, setListicleVariable] = useState({});
	const [listItems, setListItems] = useState([]);
	const editableListItemsRef = useRef({});

	const iframeref = useRef();
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const [areIframeListenersLoading, setAreIframeListenersLoading] =
		useState(false);

	const titleElRef = useRef(undefined);
	const contentElRef = useRef(undefined);
	const [_, setLastClickedTime] = useState(undefined);

	const [errMsg, setErrMsg] = useState('');

	const areIframeListenersLoaded = !areIframeListenersLoading && isIframeLoaded;
	const styleProps = {
		areIframeListenersLoaded,
	};
	const classes = useStyles(styleProps);

	useEffect(() => {
		const timer = setTimeout(() => {
			setErrMsg('');
		}, 5000);

		return () => clearTimeout(timer);
	}, [errMsg]);

	const resetScrapedItemsState = () => {
		setListItems([]);
		editableListItemsRef.current = {};
	};

	const resetComponentState = () => {
		resetScrapedItemsState();

		setUrlHtml('');
		setListicleVariable({});
		setIsIframeLoaded(false);
		titleElRef.current = undefined;
		contentElRef.current = undefined;
		setAreIframeListenersLoading(true);
	};

	const consumeArrayOfDocuments = (arrayOfDocuments) => {
		if (arrayOfDocuments) {
			const filteredItems = arrayOfDocuments.filter((doc) => doc.title);
			const itemsDict = {};
			filteredItems.forEach((item, index) => (itemsDict[index] = item));
			editableListItemsRef.current = itemsDict;
			setListItems(filteredItems);
		}
	};

	useEffect(() => {
		if (listURL) {
			resetComponentState();

			fetch(
				`https://python-list-scrapper.herokuapp.com/extracthtml/?url=${listURL}`
			)
				.then((response) => response.json())
				.then((data) => {
					const html = decodeURIComponent(
						escape(window.atob(data.encodedHtml))
					);
					setUrlHtml(html);
					consumeArrayOfDocuments(data.arrayOfDocuments);
				})
				.catch((error) => {
					setErrMsg('URL seems to be broken');
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

					//REFACTOR: explain which action refer to sandbox?
					if (!titleElRef.current && !contentElRef.current) {
						e.target.style.background = 'lightcoral';
						titleElRef.current = e.target;
					} else if (titleElRef.current && !contentElRef.current) {
						if (titleElRef.current === e.target) {
							//unclick title
							e.target.style.background = '';
							titleElRef.current = undefined;
						} else {
							//click content
							e.target.style.background = 'bisque';
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
							e.target.style.background = 'bisque';
							contentElRef.current = e.target;
						}
					}

					//basically used to re-render component, since state is frozen within eventListeners
					setLastClickedTime(Date.now());
				});
			});
			setAreIframeListenersLoading(false);
		}
	}, [isIframeLoaded]);

	const extractList = () => {
		if (titleElRef.current && contentElRef.current) {
			const [tSelector, cSelector] = getSelectorsFromElements(
				titleElRef.current,
				contentElRef.current
			);

			resetScrapedItemsState();

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

					consumeArrayOfDocuments(data.arrayOfDocuments);
				})
				.catch((error) => {
					console.error('Extract List Error:', error);
				});
		}
	};

	const [submitListicle] = useMutation(SUBMIT_LISTICLE);

	const addItemsToMap = () => {
		const editedItems = editableListItemsRef.current;
		const reshapedItemsArray = Object.keys(editedItems).reduce(
			(result, key) => {
				if (editedItems[key].googlePlaceData) {
					const searchedItem = editedItems[key].googlePlaceData;
					const scrapedContent = editedItems[key].content;
					const reshapedItem = reshapeGoogleObject(
						searchedItem,
						scrapedContent
					);
					result.push(reshapedItem);
				}
				return result;
			},
			[]
		);

		if (reshapedItemsArray.length !== 0) {
			dispatch({
				type: 'ADD_SPOTS',
				payload: {
					newSpots: reshapedItemsArray,
					categories: ['Searched'],
				},
			});

			if (areListicleVariablesPresent(listicleVariable)) {
				submitListicle({
					variables: listicleVariable,
				});
			}

			setListScraperOpen(false);
			setSnackMessage({ text: 'Added list items to maps!', code: 'Confirm' });
		} else {
			setErrMsg('None of the items has a Google Place selected');
		}
	};

	return (
		<div className={classes.page} data-testid="list-scraper-component">
			{errMsg && (
				<div
					className={classes.errorMessage}
					data-testid="list-scraper-err-msg"
				>
					<p>{errMsg}</p>
				</div>
			)}
			{/*TODO: buffer for typing? do people usually copy paste? */}
			<label>
				Copy-paste in listcle URL
				<input
					data-testid="list-scraper-url-input"
					className={classes.urlInput}
					value={listURL}
					onChange={(e) => setListURL(e.target.value.trim())}
				/>
			</label>
			{areIframeListenersLoading && <CircularProgress size={20} />}
			{areIframeListenersLoaded && (
				// msg for listeners are loading?
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
						<button data-testid="extract-list-button" onClick={extractList}>
							Extract List
						</button>
					)}
				</div>
			)}
			{listItems.length !== 0 && (
				<div>
					<div className={classes.listItems}>
						{listItems &&
							listItems.map((item, idx) => (
								<ScrapedListItem
									key={item.title}
									title={item.title}
									content={item.content}
									index={idx}
									listItemRef={editableListItemsRef}
								/>
							))}
					</div>
					<button data-testid="add-items-to-map-button" onClick={addItemsToMap}>
						Add items to map
					</button>
				</div>
			)}

			<div className={classes.iframe}>
				{/* TODO: tune out all the network errors within iframe */}
				{/* REFACTOR: move condition into your visibility prop? */}
				{urlHtml && (
					<iframe
						data-cy="the-frame"
						sandbox
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
