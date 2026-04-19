/* eslint-disable no-undef */
describe('Happy Path', () => {
  const uniqueEmail = `test_happy_${Date.now()}@example.com`;
  const password = 'Password1234';
  const name = 'Test Admin';

  const login = () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  };

  const register = () => {
    cy.visit('/register');
    cy.get('input[type="text"]').first().type(name);
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  }

  const getToDashboard = () => {
    login();
    cy.visit('/dashboard');
  }

  
  it('Landing page shows login/register entries', () => {
    cy.visit('/');
    cy.contains('Presto').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
  });
  
  it('Register successfully', () => {
    register();
    cy.contains('Your presentations').should('be.visible');
  });

  it('login successfully', () => {
    login();
    cy.contains('Your presentations').should('be.visible');
  });
  
  it('Create a new presentation successfully', () => {
    getToDashboard();
    cy.get('aside:visible button').contains('+').click();
    cy.get('input[placeholder="Enter presentation name"]').type('My Test Presentation');
    cy.get('textarea[placeholder="Enter description"]').type('My Test Description');
    cy.contains('button', 'Create').click();
    cy.contains('My Test Presentation').should('be.visible');
    cy.contains('1 slides').should('be.visible');
  });

  it('Dashboard card displays required info', () => {
    getToDashboard();
    cy.contains('My Test Presentation').should('be.visible');
    cy.contains('1 slides').should('be.visible');
    cy.get('.cursor-pointer').should('be.visible');
  });

  it('Update thumbnail and name of presentation', () => {
    getToDashboard();
    cy.contains('My Test Presentation').click();
    cy.url().should('match', /\/presentation\//);
    cy.contains('My Test Presentation').should('be.visible');

    cy.get('img[alt="Edit"]').click();

    cy.get('input[placeholder="Enter presentation name"]').clear().type('Updated Presentation');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dummyImg.png', { force: true })
    cy.contains('button', 'Save Changes').click();

    cy.contains('Updated Presentation').should('be.visible');
    cy.get('img[alt="Presentation thumbnail"]').should('be.visible');
  });

  it('Add slides in a slideshow deck', () => {
    getToDashboard();
    cy.contains('Updated Presentation').click();

    cy.get('aside:visible button').contains('+').click();
    cy.wait(1000);
    cy.get('aside:visible button').contains('+').click();
    cy.wait(1000);

    cy.get('button').contains('←').should('be.visible');
    cy.get('button').contains('→').should('be.visible');
  });

  it('Switch between slides', () => {
    getToDashboard();
    cy.contains('Updated Presentation').click();
    cy.get('button').contains('→').click();
    cy.url().should('include', 'slide=1');
    cy.get('button').contains('←').click();
    cy.url().should('include', 'slide=0');

    cy.get('body').type('{rightarrow}');
    cy.url().should('include', 'slide=1');
    cy.get('body').type('{leftarrow}');
    cy.url().should('include', 'slide=0');

    cy.get('button').contains('←').should('have.class', 'cursor-not-allowed');
    cy.get('body').type('{rightarrow}');
    cy.get('body').type('{rightarrow}');
    cy.url().should('include', 'slide=2');
    cy.get('button').contains('→').should('have.class', 'cursor-not-allowed');
  });

  it('Delete a presentation: No dismisses, Yes deletes', () => {
    getToDashboard();
    cy.contains('Updated Presentation').click();
    cy.url().should('match', /\/presentation\//);

    cy.get('button').contains('🗑️').click();
    cy.contains('Are you sure?').should('be.visible');

    cy.contains('button', 'No').click();
    cy.contains('Are you sure?').should('not.exist');
    cy.url().should('match', /\/presentation\//);
    cy.get('button').contains('🗑️').click();
    cy.contains('button', 'Yes').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Updated Presentation').should('not.exist');
  });

  it('Log out successfully', () => {
    getToDashboard()
    cy.contains('button', 'Logout').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.window().then((win) => {
      cy.wrap(win.localStorage.getItem('token')).should('be.null');
    });
  });

  it('Log back in via Enter key', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    cy.get('input[type="password"]').type('{enter}');
    cy.url().should('include', '/dashboard');
    cy.window().then((win) => {
      cy.wrap(win.localStorage.getItem('token')).should('not.be.null');
    });
  });

  it('Login failure shows error popup', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Email or Password incorrect').should('be.visible');

    cy.get('[class*="bg-red"]').find('button').click();
    cy.contains('Email or Password incorrect').should('not.exist');
  });
});