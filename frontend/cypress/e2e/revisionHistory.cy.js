describe('Revision History Flow', () => {
  const uniqueEmail = `test_rev_${Date.now()}@example.com`;
  const password = 'Password1234';
  const name = 'Revision User';

  const login = () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  };

  const createPresentation = () => {
    login();
    cy.visit('/dashboard');
    cy.get('aside button').contains('+').click();
    cy.get('input[placeholder="Enter presentation name"]').type('Revision Test Deck');
    cy.contains('button', 'Create').click();
    cy.contains('Revision Test Deck').should('be.visible');
  };

  const goToEditor = () => {
    login();
    cy.visit('/dashboard');
    cy.contains('Revision Test Deck').click();
    cy.url().should('match', /\/presentation\//);
  };

  before(() => {
    cy.visit('/register');
    cy.get('input[type="text"]').first().type(name);
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('creates a presentation for revision testing', () => {
    createPresentation();
  });

  it('opens revision history modal and sees empty state', () => {
    goToEditor();
    cy.contains('button', 'History').click();
    cy.contains('Revision History').should('be.visible');
    cy.contains('No revision yet').should('be.visible');
    cy.contains('button', 'Close').click();
    cy.contains('Revision History').should('not.exist');
  });

  it('captures a revision after making an edit', () => {
    goToEditor();

    // Mock Date so the 60s revision throttle passes instantly
    cy.clock(Date.now(), ['Date']);

    // Add a text element to trigger captureRevision
    cy.get('aside button').contains('T').click();
    cy.contains('New Text').should('be.visible');
    cy.get('textarea[placeholder="Your text goes here"]').type('First edit');
    cy.contains('button', 'create').click();
    cy.contains('First edit').should('be.visible');

    // Fast-forward past the 60s throttle
    cy.tick(61000);

    // Make another edit to trigger a new revision capture
    cy.get('aside button').contains('+').click();
    cy.wait(1000);

    // Open revision history — should show at least one entry
    cy.contains('button', 'History').click();
    cy.contains('Revision History').should('be.visible');
    cy.get('ul li').should('have.length.at.least', 1);
    cy.contains('slide').should('be.visible');
    cy.contains('button', 'Close').click();

    cy.clock().then((clock) => clock.restore());
  });

  it('restores an older version from revision history', () => {
    goToEditor();

    cy.clock(Date.now(), ['Date']);

    // Add a text element to capture an initial revision
    cy.get('aside button').contains('T').click();
    cy.contains('New Text').should('be.visible');
    cy.get('textarea[placeholder="Your text goes here"]').type('Version A');
    cy.contains('button', 'create').click();
    cy.contains('Version A').should('be.visible');

    // Fast-forward so next edit creates a second revision
    cy.tick(61000);

    // Add another slide to create a newer revision (2 slides)
    cy.get('aside button').contains('+').click();
    cy.wait(1000);

    // Open revision history and restore the older version (1 slide)
    cy.contains('button', 'History').click();
    cy.contains('Revision History').should('be.visible');

    // Restore the oldest revision (last in the sorted list)
    cy.get('ul li').last().find('button').contains('Restore').click();

    // Modal should close after restore
    cy.contains('Revision History').should('not.exist');

    cy.clock().then((clock) => clock.restore());
  });

  it('makes a new edit after restoring and sees a new revision entry', () => {
    goToEditor();

    cy.clock(Date.now(), ['Date']);

    // Add a text element to trigger a new revision capture
    cy.get('aside button').contains('T').click();
    cy.contains('New Text').should('be.visible');
    cy.get('textarea[placeholder="Your text goes here"]').type('Post-restore edit');
    cy.contains('button', 'create').click();
    cy.contains('Post-restore edit').should('be.visible');

    // Fast-forward past the throttle
    cy.tick(61000);

    // Add another slide to trigger capture
    cy.get('aside button').contains('+').click();
    cy.wait(1000);

    // Open history and verify new revision entries exist
    cy.contains('button', 'History').click();
    cy.contains('Revision History').should('be.visible');
    cy.get('ul li').should('have.length.at.least', 1);
    cy.contains('button', 'Close').click();

    cy.clock().then((clock) => clock.restore());
  });

  it('closes the revision history modal without restoring', () => {
    goToEditor();
    cy.contains('button', 'History').click();
    cy.contains('Revision History').should('be.visible');
    cy.contains('button', 'Close').click();
    cy.contains('Revision History').should('not.exist');
  });
});