// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

Cypress.Commands.add('dragAndDrop', (subject, target) => {
	Cypress.log({
		name: 'DRAGNDROP',
		message: `Dragging element ${subject} to ${target}`,
		consoleProps: () => {
			return {
				subject: subject,
				target: target,
			};
		},
	});
	const BUTTON_INDEX = 0;
	const SLOPPY_CLICK_THRESHOLD = 10;
	cy.get(target)
		.first()
		.then(($target) => {
			let coordsDrop = $target[0].getBoundingClientRect();
			cy.get(subject)
				.first()
				.then((subject) => {
					const coordsDrag = subject[0].getBoundingClientRect();
					cy.wrap(subject)
						.trigger('mousedown', {
							button: BUTTON_INDEX,
							clientX: coordsDrag.x,
							clientY: coordsDrag.y,
							force: true,
						})
						.trigger('mousemove', {
							button: BUTTON_INDEX,
							clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
							clientY: coordsDrag.y,
							force: true,
						});
					cy.get('body')
						.trigger('mousemove', {
							button: BUTTON_INDEX,
							clientX: coordsDrop.x + 10,
							clientY: coordsDrop.y + 10,
							force: true,
						})
						.trigger('mouseup');
				});
		});
});
// Alternatively you can use CommonJS syntax:
// require('./commands')
