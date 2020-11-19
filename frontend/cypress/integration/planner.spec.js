describe('Planner', function () {
	beforeEach(function () {
		cy.visit('http://localhost:3000/');
		cy.get('[data-testid="nav-trips"]').click();
		cy.get('#username').type('wen');
		cy.get('#password').type('123456');
		cy.get('#enterUser').click();
		cy.wait(500);
		cy.visit(
			'http://localhost:3000/planner/5ed7aee473e66d73abe88279/5f187e21bef1b67b990678b6'
		);
	});

	it('All tests split up', () => {
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
		cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
			cy.get('[data-testid="spot-card"]').should('have.length', 2);
			cy.get('[data-testid="filled-heart"]').first().click();
			cy.get('[data-testid="spot-card"]').should('have.length', 1);
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

		cy.get('[data-testid="nav-trips-user"]')
			.click()
			.then(() => {
				cy.get('[data-testid="nav-prompt"]').should('have.length', 1);
			});
	});
});
