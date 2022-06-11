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

	return (
		<div className={classes.page}>
			<input
				className={classes.urlInput}
				value={listURL}
				onChange={(e) => setListURL(e.target.value)}
			/>
			<div className={classes.iframe}>
				<iframe width="100%" height="100%" srcDoc={urlHtml} />
			</div>
		</div>
	);
};

export default ListScraper;
