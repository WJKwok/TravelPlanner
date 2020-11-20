describe('Planner', function () {
	beforeEach(function () {
		cy.visit('http://localhost:3000/');
	});

	it('test as non-user', () => {});

	it('test as a user', () => {
		//logging in
		cy.get('[data-testid="nav-trips"]').click();
		cy.get('#username').type('wen');
		cy.get('#password').type('123456');
		cy.get('#enterUser').click();
		cy.wait(500);
		cy.visit(
			'http://localhost:3000/planner/5ed7aee473e66d73abe88279/5f187e21bef1b67b990678b6'
		);

		//boards are loaded
		cy.get('[data-testid=day-board]').should('have.length', 3);
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 6);
		});

		//clicked unclicked chip shows more cards
		cy.get('[data-testid=Retail-chip-notClicked]').click();
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 11);
		});

		//clicked clicked chip will hide cards
		cy.get('[data-testid=Retail-chip-clicked]').click();
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 6);
		});

		//liking a card
		cy.get('[data-testid="filled-heart"]').should('have.length', 3);
		cy.get('[data-testid="spot-card"]')
			.contains('Katz Orange')
			.parent()
			.within(() => {
				cy.get('[data-testid="hollow-heart"]').first().click();
			});
		cy.get('[data-testid="filled-heart"]').should('have.length', 4);

		//unclicked all chips except 'liked'
		cy.get('[data-testid*=chip-clicked]').each(($clickedChip) => {
			$clickedChip.click();
		});
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 0);
		});
		cy.get('[data-testid=Liked-chip-notClicked]').each(($clickedChip) => {
			$clickedChip.click();
		});

		//unliking a card
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 3);
			// this is the Katz Orange card
			cy.get('[data-testid="filled-heart"]').first().click();
			cy.get('[data-testid="spot-card"]').should('have.length', 2);
		});

		//save will show green success snackbar
		cy.get('#save')
			.click()
			.then(() => {
				cy.get('[data-testId=snackBar]')
					.contains('Your trip has been saved')
					.should('have.length', 1);
			});

		//switching dates changes number of boards
		cy.get('#startDate').click();
		cy.get(':nth-child(5) > :nth-child(4)')
			.click()
			.then(() => {
				cy.get('[data-testid=day-board]').should('have.length', 2);
			});
		//select back the old date
		cy.get('#startDate').click();
		cy.get(':nth-child(5) > :nth-child(3) > .MuiButtonBase-root')
			.click()
			.then(() => {
				cy.get('[data-testid=day-board]').should('have.length', 3);
			});

		// card collapse and uncollapse
		cy.get('[data-testid="collapseContent-5f7864e5a1fea03c638ead0b"]').should(
			'not.exist'
		);
		cy.get('[data-testid="5f7864e5a1fea03c638ead0b"]').click('topRight');
		cy.get('[data-testid="collapseContent-5f7864e5a1fea03c638ead0b"]');

		// navigating away without saving will open navPrompt; then stay
		cy.get('[data-testid="nav-trips-user"]')
			.click()
			.then(() => {
				cy.get('[data-testid="nav-prompt"]').should('have.length', 1);
				cy.get('#stay').click();
			});

		//moving event card to right date
		cy.get('[data-testid="5f7864e5a1fea03c638ead0b"]').then(($eventCard) => {
			cy.get('[data-testid="event-card-date"]').should(($dateDiv) => {
				expect($dateDiv).to.have.length(1);
				const className = $dateDiv[0].className;
				expect(className).to.match(/spotEventWrongDay-/);
			});

			cy.get('[data-testid="5f7864e5a1fea03c638ead0b"]')
				.trigger('keydown', { keyCode: 32, which: 32 })
				.trigger('keydown', { keyCode: 39, which: 39, force: true })
				.trigger('keydown', { keyCode: 32, which: 32, force: true });

			cy.get('[data-testid="event-card-date"]').should(($dateDiv) => {
				expect($dateDiv).to.have.length(1);
				const className = $dateDiv[0].className;
				expect(className).to.not.match(/spotEventWrongDay-/);
			});
		});

		// Google search for an item
		// item that already exits
		cy.get('#google-search')
			.type('Burgermeister Schlesisches Tor')
			.then(() => {
				cy.get('[data-testId="google-search-suggestion"]')
					.first()
					.click()
					.then(() => {
						cy.get('[data-testId=snackBar]')
							.contains('Item already exists')
							.should('have.length', 1);
					});
			});
		// item that does not exist yet
		cy.get('#google-search')
			.type('1990 Vegan Living')
			.then(() => {
				cy.get('[data-testId="google-search-suggestion"]')
					.first()
					.click()
					.then(() => {
						cy.get('[data-testId=snackBar]')
							.contains('Spot has been added')
							.should('have.length', 1);
						cy.get('[data-testid*=chip-clicked]').each(($clickedChip) => {
							$clickedChip.click();
						});
						cy.get('[data-testid=Searched-chip-notClicked]').each(
							($clickedChip) => {
								$clickedChip.click();
							}
						);
						cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
							cy.get('[data-testid="spot-card"]').contains('1990 Vegan');
						});
					});
			});

		// navigating away without saving will open navPrompt; if leave will see 'trips'
		cy.get('[data-testid="nav-trips-user"]')
			.click()
			.then(() => {
				cy.get('[data-testid="nav-prompt"]').should('have.length', 1);
				cy.get('#leave').click();
				cy.get('[data-testid*=tripCard]').its('length').should('be.gt', 0);
			});
	});
});
