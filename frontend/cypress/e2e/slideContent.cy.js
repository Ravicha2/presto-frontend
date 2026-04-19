
/* eslint-disable no-undef */
describe('Slide Content & Customization Path', () => {
  const uniqueEmail = `test_editor_${Date.now()}@example.com`;
  const password = 'Password1234';

  const name = 'Editor User';before(() => {
    cy.visit('/register');
    cy.get('input[type="text"]').first().type(name);
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  const login = () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  };

  const goToEditor = () => {
    login();
    cy.visit('/dashboard');
    cy.contains('Editor Test Deck').click();
    cy.url().should('match', /\/presentation\//);
  };

  it('creates a presentation and opens the editor', () => {
    login();
    cy.visit('/dashboard');

    cy.get('aside:visible button').contains('+').click();
    cy.get('input[placeholder="Enter presentation name"]').type('Editor Test Deck');
    cy.contains('button', 'Create').click();

    cy.contains('Editor Test Deck').click();
    cy.url().should('match', /\/presentation\//);
    cy.contains('Editor Test Deck').should('be.visible');
  });

  it('adds and drags a text element', () => {
    goToEditor();
    cy.get('aside:visible button').contains('T').click();

    cy.contains('New Text').should('be.visible');
    cy.get('textarea[placeholder="Your text goes here"]').type('Hello Cypress Test');
    cy.contains('button', 'create').click();

    cy.contains('Hello Cypress Test').should('be.visible');

    cy.intercept('PUT', '**/store').as('saveTextDrag');
    cy.get('.shadow-2xl.aspect-video').contains('Hello Cypress Test')
      .trigger('mousedown', { which: 1, button: 0, force: true });
    cy.get('body')
      .trigger('mousemove', { clientX: 1, clientY: 1, force: true })
      .trigger('mouseup', { force: true });

    cy.wait('@saveTextDrag');
    cy.get('.shadow-2xl.aspect-video').contains('Hello Cypress Test').should('be.visible');
  });

  it('adds and drags an image element', () => {
    goToEditor();

    cy.get('aside p').contains('Upload').parent().find('button').click();

    cy.contains('Upload Image or URL').should('be.visible');
    cy.get('input[placeholder="https://example.com/image.png"]').type('https://picsum.photos/200/300');
    cy.get('textarea').eq(0).type('Test alt text');
    cy.contains('button', 'Upload Image').click();

    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]').should('be.visible');

    cy.intercept('PUT', '**/store').as('saveImageDrag');
    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]')
      .trigger('mousedown', { which: 1, button: 0, force: true });
    cy.get('body')
      .trigger('mousemove', { clientX: 3, clientY: 1, force: true })
      .trigger('mouseup', { force: true });

    cy.wait('@saveImageDrag');
    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]').should('be.visible');
  });

  it('adds and drags a video element', () => {
    goToEditor();

    cy.get('aside p').contains('Upload').parent().find('button').click();

    cy.contains('button', 'Video').click();

    cy.get('input[placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"]')
      .type('https://www.youtube.com/embed/6PEeHCfpIWo?si=mb6f7EsaZKX5tVXr');
    cy.contains('button', 'Add Video').click();

    cy.get('.shadow-2xl.aspect-video iframe[src*="6PEeHCfpIWo"]').should('be.visible');

    // Drag video element away from top-left
    cy.intercept('PUT', '**/store').as('saveVideoDrag');
    cy.get('.shadow-2xl.aspect-video iframe[src*="6PEeHCfpIWo"]').parent()
      .trigger('mousedown', { which: 1, button: 0, force: true });
    cy.get('body')
      .trigger('mousemove', { clientX: 5, clientY: 2, force: true })
      .trigger('mouseup', { force: true });

    cy.wait('@saveVideoDrag');
    cy.get('.shadow-2xl.aspect-video iframe[src*="6PEeHCfpIWo"]').should('be.visible');
  });

  it('adds and drags a code block element', () => {
    goToEditor();
    cy.get('aside p').contains('Add Code').parent().find('button').click();
    cy.contains('New Code Block').should('be.visible');
    cy.get('input[placeholder="Enter Box Width"]').clear().type('5');
    cy.get('input[placeholder="Enter Box Height"]').clear().type('3');
    cy.get('textarea[placeholder="Paste your code here"]').type('console.log("hello");');
    cy.contains('button', 'Create').click();

    cy.get('.shadow-2xl.aspect-video pre code').should('be.visible');

    // Drag code element away from top-left
    cy.intercept('PUT', '**/store').as('saveCodeDrag');
    cy.get('.shadow-2xl.aspect-video pre code')
      .trigger('mousedown', { which: 1, button: 0, force: true });
    cy.get('body')
      .trigger('mousemove', { clientX: 7, clientY: 3, force: true })
      .trigger('mouseup', { force: true });

    cy.wait('@saveCodeDrag');
    cy.get('.shadow-2xl.aspect-video pre code').should('be.visible');
  });

  it('edits a text element via double-click', () => {
    goToEditor();
    cy.intercept('PUT', '**/store').as('saveTextEdit');
    cy.get('.shadow-2xl.aspect-video').contains('Hello Cypress Test').dblclick({ force: true });
    cy.contains('Edit Text').should('be.visible');
    cy.get('textarea').last().clear().type('Edited Text');
    cy.contains('button', 'Save Change').click();
    cy.wait('@saveTextEdit');
  });

  it('edits an image element via double-click', () => {
    goToEditor();
    cy.intercept('PUT', '**/store').as('saveImageEdit');
    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]').dblclick({ force: true });
    cy.contains('Edit Image').should('be.visible');
    cy.get('input[placeholder="https://example.com/image.png"]').clear().type('https://picsum.photos/200');
    cy.contains('button', 'Save Change').click();
    cy.wait('@saveImageEdit');
  });

  it('edits a video element via double-click', () => {
    goToEditor();
    cy.intercept('PUT', '**/store').as('saveVideoEdit');
    cy.get('.shadow-2xl.aspect-video iframe[src*="6PEeHCfpIWo"]').dblclick({ force: true });
    cy.contains('Edit Video').should('be.visible');
    cy.contains('button', 'Add Video').click();
    cy.wait('@saveVideoEdit');
  });

  it('edits a code block element via double-click', () => {
    goToEditor();
    cy.intercept('PUT', '**/store').as('saveCodeEdit');
    cy.get('.shadow-2xl.aspect-video pre code').dblclick({ force: true });
    cy.contains('Edit Code Block').should('be.visible');
    cy.get('textarea[placeholder="Paste your code here"]').clear().type('print("edited")');
    cy.contains('button', 'Save Change').click();
    cy.wait('@saveCodeEdit');
  });

  it('deletes an element via right-click context menu', () => {
    goToEditor();
    cy.get('.shadow-2xl.aspect-video').contains('Edited Text').should('be.visible');
    cy.get('.shadow-2xl.aspect-video').contains('Edited Text').rightclick({ force: true });
    cy.contains('button', 'Delete').should('be.visible').click();
    cy.get('.shadow-2xl.aspect-video').contains('Edited Text').should('not.exist');
  });

  it('reorders elements via context menu bring to front / send to back', () => {
    goToEditor();
    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]')
      .rightclick({ force: true });
    cy.contains('button', 'Bring to Front').should('be.visible').click();
    cy.get('.shadow-2xl.aspect-video img[alt="Test alt text"]').rightclick({ force: true });
    cy.contains('button', 'Send to Back').should('be.visible').click();
  });

  it('sets a solid colour background via theme modal', () => {
    goToEditor();
    cy.get('aside p').contains('Set Theme').parent().find('button').click();
    cy.contains('Theme & Background').should('be.visible');
    cy.get('input[type="color"]').first().invoke('val', '#ff0000').trigger('input');
    cy.contains('button', 'Apply').click();
    cy.get('.shadow-2xl.aspect-video > .relative').should('have.css', 'background-color').and('match', /rgb\(255/);
  });

  it('sets a gradient background via theme modal', () => {
    goToEditor();
    cy.get('aside p').contains('Set Theme').parent().find('button').click();
    cy.contains('Theme & Background').should('be.visible');
    cy.get('select').eq(1).select('gradient');
    cy.contains('Gradient Direction').should('be.visible');
    cy.contains('button', 'Apply').click();
    cy.get('.shadow-2xl.aspect-video > .relative').should('have.css', 'background-image').and('include', 'linear-gradient');
  });

  it('sets an image background via theme modal URL', () => {
    goToEditor();
    cy.get('aside p').contains('Set Theme').parent().find('button').click();
    cy.contains('Theme & Background').should('be.visible');
    cy.get('select').eq(1).select('image');
    cy.contains('URL').should('be.visible');
    cy.get('input[placeholder="Paste image URL here"]').type('https://picsum.photos/800/600');
    cy.contains('button', 'Apply').click();
    cy.get('.shadow-2xl.aspect-video > .relative').should('have.css', 'background-image').and('match', /url/);
  });
});