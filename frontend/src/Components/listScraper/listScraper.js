import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ScrapedListItem } from './scrapedListItem';
import { SelectionCheckList } from './partials/SelectionCheckList';
import { SnackBarContext, SpotContext } from 'Store';
import { reshapeGoogleObject } from 'utils/reshapeGoogleObject';
import { useMutation, gql } from '@apollo/client';
import {
	getSelectorsFromElements,
	areListicleVariablesPresent,
	elementClickLogic,
	consumeArrayOfDocuments,
} from './utils';

import { debounce } from 'lodash';

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

	const fetchUrlHtml = (listURL) => {
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
					consumeArrayOfDocuments(
						data.arrayOfDocuments,
						editableListItemsRef,
						setListItems
					);
				})
				.catch(() => {
					setErrMsg('URL seems to be broken');
					setAreIframeListenersLoading(false);
				});
		}
	};

	const debouncedFetchUrlHtml = useMemo(
		() => debounce((url) => fetchUrlHtml(url), 1500),
		[]
	);

	// Stop the invocation of the debounced function after unmounting
	useEffect(() => {
		return () => {
			debouncedFetchUrlHtml.cancel();
		};
	}, [debouncedFetchUrlHtml]);

	const urlInputChangeHandler = (e) => {
		const urlInput = e.target.value.trim();
		setListURL(urlInput);
		debouncedFetchUrlHtml(urlInput);
	};

	useEffect(() => {
		const doc = iframeref.current;

		if (isIframeLoaded) {
			const elements = doc.contentDocument.querySelectorAll('*');
			elements.forEach((element) => {
				element.addEventListener('click', (e) => {
					//prevent bubbling
					//prevent page links from opening
					e.stopPropagation();
					e.preventDefault();

					elementClickLogic(e, titleElRef, contentElRef);

					//basically used to re-render component, since state is frozen within eventListeners
					setLastClickedTime(Date.now());
				});
			});
			setAreIframeListenersLoading(false);
		}
	}, [isIframeLoaded]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setErrMsg('');
		}, 5000);

		return () => clearTimeout(timer);
	}, [errMsg]);

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
					setListicleVariable({
						url: listURL,
						titleSelector: tSelector,
						contentSelector: cSelector,
					});

					consumeArrayOfDocuments(
						data.arrayOfDocuments,
						editableListItemsRef,
						setListItems
					);
				})
				.catch((error) => {
					setErrMsg('There is an error with list extraction 😞');
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
					onChange={urlInputChangeHandler}
				/>
			</label>
			{areIframeListenersLoading && <CircularProgress size={20} />}
			{areIframeListenersLoaded && (
				<SelectionCheckList
					titleElRef={titleElRef}
					contentElRef={contentElRef}
					extractListHandler={extractList}
				/>
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
