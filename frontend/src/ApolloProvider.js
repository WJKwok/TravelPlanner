import React, { useState, useEffect } from 'react';
import App from './App';

import {
	ApolloClient,
	ApolloLink,
	createHttpLink,
	InMemoryCache,
	fromPromise,
	ApolloProvider,
	split,
	gql,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import QueueLink from 'apollo-link-queue';
import SerializingLink from 'apollo-link-serialize';

import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import safeJsonStringify from 'safe-json-stringify';

const getNewToken = async () => {
	console.log('refreshToken', localStorage.getItem('refreshToken'));

	const client = await getClient();
	return client
		.mutate({
			mutation: REFRESH_TOKEN,
			variables: {
				refreshToken: localStorage.getItem('refreshToken'),
			},
		})
		.then((response) => {
			// extract your accessToken from your response data and return it
			console.log('is there a response?', response);
			return response.data.refreshToken.accessToken;
		});
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, extensions }) =>
			console.log({ message, extensions })
		);
		for (let err of graphQLErrors) {
			switch (err.extensions.code) {
				case 'UNAUTHENTICATED':
					return fromPromise(
						getNewToken().catch((error) => {
							console.log('error:', error);
							// Handle token refresh errors e.g clear stored tokens, redirect to login
							return;
						})
					)
						.filter((value) => Boolean(value))
						.flatMap((accessToken) => {
							console.log('accessToken', accessToken);
							localStorage.setItem('jwtToken', accessToken);
							// const oldHeaders = operation.getContext().headers;
							// // modify the operation context with a new token
							operation.setContext({
								headers: {
									Authorization: `Bearer ${accessToken}`,
								},
							});

							// retry the request, returning the new observable
							return forward(operation);
							// return forward();
						});
			}
		}
	}
});

const retryLink = new RetryLink({ attempts: { max: Infinity } });

const queueLink = new QueueLink();
window.addEventListener('offline', () => queueLink.close());
window.addEventListener('online', () => queueLink.open());

const serializingLink = new SerializingLink();

const trackerLink = new ApolloLink((operation, forward) => {
	console.log('tracker:', forward);
	if (forward === undefined) return null;

	const context = operation.getContext();
	const trackedQueries =
		JSON.parse(window.localStorage.getItem('trackedQueries') || null) || [];

	console.log('tracker:', context, trackedQueries);

	if (context.tracked) {
		const { operationName, query, variables } = operation;

		const newTrackedQuery = {
			query,
			context,
			variables,
			operationName,
		};
		console.log('it is tracked', newTrackedQuery);

		window.localStorage.setItem(
			'trackedQueries',
			safeJsonStringify([...trackedQueries, newTrackedQuery])
		);
	}

	return forward(operation).map((data) => {
		if (context.tracked) {
			window.localStorage.setItem(
				'trackedQueries',
				safeJsonStringify(trackedQueries)
			);
		}

		return data;
	});
});

const httpLink = createHttpLink({
	uri:
		process.env.NODE_ENV === 'production'
			? 'https://travel-planner-backend.herokuapp.com/'
			: 'http://localhost:5010/',
});

const wsLink = new WebSocketLink({
	uri:
		process.env.NODE_ENV === 'production'
			? 'wss://travel-planner-backend.herokuapp.com/subscriptions'
			: 'ws://localhost:5010/subscriptions',
	options: {
		reconnect: true,
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

const authLink = setContext(() => {
	const token = localStorage.getItem('jwtToken');
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

export const getClient = async () => {
	const cache = new InMemoryCache();

	// await before instantiating ApolloClient, else queries might run before the cache is persisted
	await persistCache({
		cache,
		storage: new LocalStorageWrapper(window.localStorage),
	});
	return new ApolloClient({
		link: ApolloLink.from([
			trackerLink,
			queueLink,
			serializingLink,
			retryLink,
			errorLink,
			authLink,
			splitLink,
		]),
		cache,
	});
};

const REFRESH_TOKEN = gql`
	mutation refreshToken($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
			accessToken
			refreshToken
		}
	}
`;

export const ApolloApp = () => {
	const [client, setClient] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getClient().then((client) => {
			setClient(client);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!client) return;

		const execute = async () => {
			const trackedQueries =
				JSON.parse(window.localStorage.getItem('trackedQueries') || null) || [];

			const updateFunction = (cache, result) => {
				console.log('update function:', { cache, result });
			};
			console.log('trackedQueries', trackedQueries);
			const promises = trackedQueries.map(
				({ variables, query, context, operationName }) =>
					client.mutate({
						context,
						variables,
						mutation: query,
						update: updateFunction,
						optimisticResponse: context.optimisticResponse,
					})
			);

			try {
				await Promise.all(promises);
			} catch (error) {
				// A good place to show notification
			}

			window.localStorage.setItem('trackedQueries', []);
		};

		execute();
	}, [client]);

	if (loading) {
		return <h2>Initializing app...</h2>;
	}

	return (
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	);
};
