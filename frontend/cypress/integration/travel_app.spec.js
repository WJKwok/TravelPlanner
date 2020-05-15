describe('Travel app', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })
    it('front page can be opened', () => {
        cy.contains('Select City')
    })

    it('user can login', function() {
        cy.contains('Login').click()
        cy.get('#username').type('wen')
        cy.get('#password').type('123456')
        cy.get('#login-button').click()
        cy.contains('Wen')
        cy.contains('Zurich')
        cy.get(`[class*="itineraryCard"]`).first().click()
    })
})


// cy.get(`[data-testid="itineraryCard"]`).click()
// data-testid="itineraryCard"