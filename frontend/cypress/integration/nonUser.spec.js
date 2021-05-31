it('test as non-user', () => {
	cy.visit('http://localhost:3000/planner/5ed7aee473e66d73abe88279/');

	// plain planner check
	const todaysDate = Cypress.moment().format('ddd,DD MMM,YYYY').split(',');
	const tmrDate = Cypress.moment()
		.add(1, 'days')
		.format('ddd,DD MMM,YYYY')
		.split(',');

	cy.get('[data-testid="day-select-menu"]').contains(todaysDate[0]);
	cy.get('#startDate')
		.invoke('val')
		.then(($dateVal) => {
			expect(`${todaysDate[1]} ${todaysDate[2]}`).to.equal($dateVal);
		});
	cy.get('#endDate')
		.invoke('val')
		.then(($dateVal) => {
			expect(`${tmrDate[1]} ${tmrDate[2]}`).to.equal($dateVal);
		});

	cy.get('[data-testid=day-board]').should('have.length', 2);

	// chip click
	cy.get('[data-testid=spots-board]').within(() => {
		cy.get('[data-testid="spot-card"]').should('have.length', 0);
	});
	cy.get('[data-testid=Retail-chip-notClicked]').click();
	cy.get('[data-testid=spots-board]').within(($spotsBoard) => {
		cy.get('[data-testid="spot-card"]').should('have.length', 5);
	});

	// change day select menu
	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=business-status]').contains(todaysDate[0]);
	});

	const tmrDay = Cypress.moment().add(1, 'days').format('dddd');
	cy.get('[data-testid="day-select-menu"]').click();
	cy.get(`[data-testid=day-select-${tmrDay}]`).click();

	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=business-status]').contains(tmrDate[0]);
	});

	//save with empty trip
	cy.get('#save')
		.click()
		.then(() => {
			cy.get('[data-testid=snackBar]')
				.contains('Your itinerary is empty')
				.should('have.length', 1);
		});

	//save trip without having logged in
	cy.get('[data-testid=5ee1fbf4aa3118be4c682992]').within(() => {
		cy.get('[data-testid=hollow-heart]').click();
	});

	cy.get('#save').click();
	cy.get('[data-testid=snackBar]')
		.contains('You have to be logged in')
		.should('have.length', 1);
	cy.get('[data-testid=auth-modal').should('have.length', 1);

	cy.get('#username').type('wen');
	cy.get('#password').type('123456');
	cy.get('#enterUser').click();
	cy.get('[data-testid=snackBar]')
		.contains('Login Success')
		.should('have.length', 1);

	cy.get('#save').click();
	cy.get('[data-testid=snackBar]')
		.contains('Your trip has been saved')
		.should('have.length', 1);

	//check if trip has been added in trips
	cy.get('[data-testid=nav-trips-user]').click();
	cy.get('#personalTrips').within(() => {
		cy.get('[data-testid*=tripCard]')
			.last()
			.within(() => {
				cy.get('[data-testid=trip-date]').contains(
					`${todaysDate[1]} - ${tmrDate[1]}`
				);
			});
	});

	//check if saved trip would open to the retail chip being already clicked
	cy.get('#personalTrips').within(() => {
		cy.get('[data-testid*=tripCard]')
			.last()
			.within(() => {
				cy.get('[data-testid=trip-date]').click();
			});
	});

	cy.get('[data-testid=Retail-chip-clicked]').should('have.length', 1);
	cy.get('[data-testid=5ee1fbf4aa3118be4c682992]').within(() => {
		cy.get('[data-testid=filled-heart]').should('have.length', 1);
	});

	//delete trip
	cy.get('[data-testid=nav-trips-user]').click();
	cy.get('#personalTrips').within(() => {
		cy.get('[data-testid*=tripCard]')
			.its('length')
			.then((tripsLength) => {
				cy.log(tripsLength);
				cy.get('[data-testid*=tripCard]')
					.last()
					.within(() => {
						cy.get('[data-testid=trip-date]').contains(
							`${todaysDate[1]} - ${tmrDate[1]}`
						);
						cy.get('[data-testid=more-actions]').click();
					});
				//way to escape 'within'
				cy.document()
					.its('body')
					.find('[data-testid=delete-trip]')
					.eq(tripsLength - 1)
					.click();
				cy.get('[data-testid*=tripCard]').should(
					'have.length',
					tripsLength - 1
				);
			});
	});
});
