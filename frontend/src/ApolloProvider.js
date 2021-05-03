import React from 'react';
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
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const getNewToken = () => {
	console.log('refreshToken', localStorage.getItem('refreshToken'));
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

export const client = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, splitLink]),
	cache: new InMemoryCache(),
});

const REFRESH_TOKEN = gql`
	mutation refreshToken($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
			accessToken
			refreshToken
		}
	}
`;

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
