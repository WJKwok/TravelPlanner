import React from 'react';
import {
	prettyDOM,
	render,
	screen,
	within,
	fireEvent,
	waitForElement,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import Planner from './planner';
import NavHeader from '../../Components/navHeader';

import {
	mocks,
	retailGetSpotsForCategoryInGuideWasCalled,
} from './mockGraphql';
import {
	AuthContext,
	SnackBarContextProvider,
	SpotContextProvider,
} from 'Store';
import { client } from '../../ApolloProvider';

const authState = {
	user: {
		email: 'wen@gmail.com',
		exp: 1605194409,
		iat: 1605190809,
		id: '5e777a579d61373a38111d12',
		username: 'wen',
	},
};

function renderWithRouterMatch(
	ui,
	{
		path = '/',
		route = '/',
		history = createMemoryHistory({ initialEntries: [route] }),
	} = {},
	authState
) {
	return {
		...render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<AuthContext.Provider value={{ authState }}>
					<SpotContextProvider>
						<SnackBarContextProvider>
							<Router history={history}>
								<NavHeader />
								<Route path={path} component={ui} />
							</Router>
						</SnackBarContextProvider>
					</SpotContextProvider>
				</AuthContext.Provider>
			</MockedProvider>
		),
	};
}

function dragAndDrop(cardToDrag, placeToDrop) {
	fireEvent.dragStart(cardToDrag);
	fireEvent.dragEnter(placeToDrop);
	fireEvent.dragOver(placeToDrop);
	fireEvent.drop(placeToDrop);
}

test('test', async () => {
	const { getByText, findByTestId } = renderWithRouterMatch(
		Planner,
		{
			route: '/planner/5ed7aee473e66d73abe88279/5f187e21bef1b67b990678b6',
			path: '/planner/:guideBookId/:tripId',
		},
		authState
	);

	const spotBoard = await screen.findByTestId('spot-board');
	const { findAllByTestId: findAllByTestIdInSpotBoard } = within(spotBoard);
	const totalCardsInSpotBoard = await findAllByTestIdInSpotBoard('spot-card');
	expect(totalCardsInSpotBoard.length).toBe(6);

	//unclicking a category
	const chipToClick = await getByText('Restaurant');
	userEvent.click(chipToClick);
	const totalCardsInSpotBoardAfterClick = await findAllByTestIdInSpotBoard(
		'spot-card'
	);
	expect(totalCardsInSpotBoardAfterClick.length).toBe(3);

	//clicking never clicked category
	const retailChip = await getByText('Retail');
	await userEvent.click(retailChip);
	await screen.findByText('The Store X Berlin');
	const totalCardsInSpotBoardAfterRetailClick =
		await findAllByTestIdInSpotBoard('spot-card');
	expect(totalCardsInSpotBoardAfterRetailClick.length).toBe(8);
	expect(retailGetSpotsForCategoryInGuideWasCalled).toBe(1);

	//unclicking and clicking an already called category
	await userEvent.click(retailChip);
	expect(await screen.queryByText('The Store X Berlin')).toBeNull();
	await userEvent.click(retailChip);
	await screen.findByText('The Store X Berlin');
	expect(retailGetSpotsForCategoryInGuideWasCalled).toBe(1);

	const cardToMove = await screen.findByTestId('ChIJ2Uh9Bk5OqEcREoy9N1LxImw');
	console.log('cardToMove', cardToMove);
	fireEvent.keyDown(cardToMove, { key: 'Tab', keyCode: 9, which: 9 });
	fireEvent.keyDown(cardToMove, { key: ' ', keyCode: 32, which: 32 });
	fireEvent.keyDown(cardToMove, { key: 'ArrowRight', keyCode: 39, which: 39 });
	fireEvent.keyDown(cardToMove, { key: ' ', keyCode: 32, which: 32 });

	const dayBoard2 = await screen.findByTestId('day1');
	const { findAllByTestId: findAllByTestIdInDayBoard2 } = within(dayBoard2);
	const totalCardsInDayBoard2 = await findAllByTestIdInDayBoard2('spot-card');
	expect(totalCardsInDayBoard2.length).toBe(6);
});
