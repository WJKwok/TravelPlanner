const getIframeDocument = () => {
	return cy
		.get('iframe[data-cy="the-frame"]')
		.its('0.contentDocument')
		.should('exist');
};

const getIframeBody = () => {
	// get the document
	return getIframeDocument()
		.its('body')
		.should('not.be.undefined')
		.then(cy.wrap);
};

describe('ListScraper', function () {
	beforeEach(() => {
		// prevent the test link from being saved in listicle collection
		cy.intercept('POST', 'http://localhost:5010/', (req) => {
			if (req.body.operationName === 'submitListicle') {
				req.reply({
					statusCode: 200,
					body: {
						listicle: {
							url: 'yes',
							titleSelector: 'yes',
							contentSelector: 'yes',
						},
					},
				});
			}
		});
	});

	it('new listicle', () => {
		cy.visit('http://localhost:3000/web/planner/5ed7aee473e66d73abe88279');
		// click on feature button
		cy.get('[data-testid="list-scraper-feature-button"]').click();
		cy.get('[data-testid="list-scraper-component"]').should('not.be.undefined');

		//input broken listicle url; see err message
		cy.get('[data-testid="list-scraper-url-input"]').type('h');
		cy.get('[data-testid="list-scraper-err-msg"]').contains(
			'URL seems to be broken'
		);
		cy.wait(5000);

		//input listicle url;
		cy.get('[data-testid="list-scraper-url-input"]')
			.clear()
			.invoke(
				'val',
				'https://theculturetrip.com/europe/germany/berlin/articles/berlin-from-the-top-the-5-best-panoramic-views/'
			)
			.type(' ');
		cy.wait(5000);

		// check for text selection prompt msgs
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should('not.contain', 'Title is selected ✅');
			cy.get('span').contains('Please select one item title in Iframe');
			cy.get('p').should('not.contain', 'Content is selected ✅');
			cy.get('p').contains('Please select one item content in Iframe');
		});
		// extract list button should not exist when both title and content items are not clicked
		cy.get('[data-testid="extract-list-button"]').should('not.exist');

		// only select title
		getIframeBody().contains('Fernsehturm (TV Tower)').click();
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should(
				'not.contain',
				'Please select one item title in Iframe'
			);
			cy.get('span').contains('Title is selected ✅');
			cy.get('p').should('not.contain', 'Content is selected ✅');
			cy.get('p').contains('Please select one item content in Iframe');
		});
		cy.get('[data-testid="extract-list-button"]').should('not.exist');

		// selected content too
		getIframeBody()
			.contains(
				'The TV tower is not only one of the most important symbols of Berlin'
			)
			.click();
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should(
				'not.contain',
				'Please select one item title in Iframe'
			);
			cy.get('span').contains('Title is selected ✅');
			cy.get('p').should(
				'not.contain',
				'Please select one item content in Iframe'
			);
			cy.get('p').contains('Content is selected ✅');
		});
		cy.get('[data-testid="extract-list-button"]').should('not.be.undefined');

		// unselect content
		getIframeBody()
			.contains(
				'The TV tower is not only one of the most important symbols of Berlin'
			)
			.click();
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should(
				'not.contain',
				'Please select one item title in Iframe'
			);
			cy.get('span').contains('Title is selected ✅');
			cy.get('p').should('not.contain', 'Content is selected ✅');
			cy.get('p').contains('Please select one item content in Iframe');
		});
		cy.get('[data-testid="extract-list-button"]').should('not.exist');

		// reselect content too
		getIframeBody()
			.contains(
				'The TV tower is not only one of the most important symbols of Berlin'
			)
			.click();
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should(
				'not.contain',
				'Please select one item title in Iframe'
			);
			cy.get('span').contains('Title is selected ✅');
			cy.get('p').should(
				'not.contain',
				'Please select one item content in Iframe'
			);
			cy.get('p').contains('Content is selected ✅');
		});
		cy.get('[data-testid="extract-list-button"]').should('not.be.undefined');

		// click on extract list
		cy.get('[data-testid="extract-list-button"]').click();
		cy.wait(5000);
		cy.get('[data-testid="scraped-list-item-component"]').should(
			'have.length',
			5
		);
		cy.get('[data-testid="add-items-to-map-button"]').should(
			'not.be.undefined'
		);

		// delete one list item
		cy.get('[data-testid="scraped-list-item-component"]')
			.first()
			.within(() => {
				cy.get('[data-testid="delete-list-item-button"]').click();
			});
		cy.get('[data-testid="scraped-list-item-component"]').should(
			'have.length',
			4
		);

		// add items to map
		cy.get('[data-testid="add-items-to-map-button"]').click();
		cy.get('[data-testid="list-scraper-component"]').should('not.exist');
		cy.get('[data-testid="map-marker-Searched"]').should('have.length', 3);
		cy.get('[data-testid="spot-card"]').should('have.length', 3);
		cy.get('[data-testid=snackBar]')
			.contains('Added list items to maps!')
			.should('have.length', 1);
	});

	it.only('previously scraped listicle', () => {
		cy.visit('http://localhost:3000/web/planner/5ed7aee473e66d73abe88279');
		// click on feature button
		cy.get('[data-testid="list-scraper-feature-button"]').click();
		cy.get('[data-testid="list-scraper-component"]').should('not.be.undefined');

		//input listicle url;
		cy.get('[data-testid="list-scraper-url-input"]')
			.clear()
			.invoke(
				'val',
				'https://misstourist.com/22-things-to-do-in-berlin-ultimate-bucket-list/'
			)
			.type(' ');
		cy.wait(5000);

		// extract list button should not exist when both title and content items are not clicked
		cy.get('[data-testid="extract-list-button"]').should('not.exist');

		cy.get('[data-testid="add-items-to-map-button"]').should(
			'not.be.undefined'
		);

		cy.get('[data-testid="scraped-list-item-component"]').should(
			'have.length',
			23
		);

		cy.wait(5000);
		// check for text selection prompt msgs
		cy.get('[data-testid="list-scraper-text-selection-prompt"]').within(() => {
			cy.get('span').should('not.contain', 'Title is selected ✅');
			cy.get('span').contains('Please select one item title in Iframe');
			cy.get('p').should('not.contain', 'Content is selected ✅');
			cy.get('p').contains('Please select one item content in Iframe');
		});
	});
});
