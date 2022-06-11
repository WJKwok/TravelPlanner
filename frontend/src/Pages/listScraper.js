import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

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
}));

const ListScraper = () => {
	const classes = useStyles();

	const [listURL, setListURL] = useState('');
	const [urlHtml, setUrlHtml] = useState('');

	const iframeref = useRef();
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const titleElRef = useRef(undefined);
	const contentElRef = useRef(undefined);

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

	return (
		<div className={classes.page}>
			<input
				className={classes.urlInput}
				value={listURL}
				onChange={(e) => setListURL(e.target.value)}
			/>
			<div className={classes.iframe}>
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
