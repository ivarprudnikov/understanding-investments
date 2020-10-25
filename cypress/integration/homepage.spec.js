/// <reference types="cypress" />

context('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('is homepage', () => {
    cy.get('.page-title').should('contain', 'Understanding')
    cy.location('pathname').should('equal', '/')
  })
})
