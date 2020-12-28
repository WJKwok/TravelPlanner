it('edit guide', () => {
	cy.visit('http://localhost:3000/logger/5ed7aee473e66d73abe88279/');

	cy.get('[data-testid*=chip-clicked]').should('have.length', 5);
	cy.get('[data-testid=spots-board]').within(() => {
		cy.get('[data-testid="spot-card"]').should('have.length', 16);
	});

	//Saving without a placeId
	cy.get('#edit-placeId').should('have.value', '');
	cy.get('#submit')
		.click()
		.then(() => {
			cy.get('[data-testid=snackBar]')
				.contains("Can't save without a Place ID")
				.should('have.length', 1);
		});

	//editing a spot
	/* Using id because data-testid didn't work. I mean it works but you have to do 'inputProps={{"data-testid":"usernameInput"}}' */

	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=edit-pen]').click();
	});

	cy.get('#edit-placeId')
		.invoke('val')
		.then(($value) => {
			expect($value).to.equal('ChIJFxOhwuNRqEcRZ8DjAJlnyL4');
		});

	//upload photo
	cy.get('[data-testid=uploadedImage]').should('have.length', 0);
	cy.get('[data-testid="file-input"]').attachFile('samplePic.jpeg');
	cy.get('[data-testid=uploadedImage]').should('have.length', 1);

	cy.get('#edit-content').type('Test');

	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=existing-image]').should('have.length', 3);
	});

	cy.get('#submit')
		.click()
		.then(() => {
			cy.get('[data-testid=snackBar]')
				.contains('Spot Saved!')
				.should('have.length', 1);
		});

	//Check if image is successfully uploaded
	cy.visit('http://localhost:3000/logger/5ed7aee473e66d73abe88279/');

	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=existing-image]').should('have.length', 4);
		cy.contains('Test');
	});

	//reset test by deleting uploaded image
	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=edit-pen]').click();
	});

	cy.get('[data-testid=edit-existing-image]').should('have.length', 4);

	cy.get('[data-testid=edit-existing-image]')
		.last()
		.within(() => {
			cy.get('[data-testid=delete-image]').click();
		});

	cy.get('#edit-content').type('{backspace}{backspace}{backspace}{backspace}');

	cy.get('#submit')
		.click()
		.then(() => {
			cy.get('[data-testid=snackBar]')
				.contains('Spot Saved!')
				.should('have.length', 1);
		});

	// check if delete was successful
	cy.visit('http://localhost:3000/logger/5ed7aee473e66d73abe88279/');

	cy.get('[data-testid="5ee1fbf4aa3118be4c682992"]').within(() => {
		cy.get('[data-testid=existing-image]').should('have.length', 3);
		cy.contains('Test').should('have.length', 0);
	});
});
