# Test Plan

## Already Covered (happyPath.cy.js)

- Auth (login, register, logout, failed login)
- Landing page
- Error popups
- Presentation CRUD
- Blank slides
- Slide navigation (arrow keys + buttons)
- Delete presentation with confirm/cancel
- Failed auth error popup

---

## Additional User Flows

### 1. Slide Content & Customisation Flow (`slideContent.cy.js`)

**User flow:** A logged-in user creates a presentation, adds various content elements to slides, edits and deletes them, and customises the visual appearance using themes and backgrounds.

**Rationale:** The core value of Presto is slide content creation and visual customisation. This flow validates that the 4 element types (text, image, video, code) can be added, edited, and removed, and that backgrounds (solid, gradient, image) render correctly with default and per-slide overrides.

**Tests:**

- Add a text element via toolbar; verify it appears at top-left of the canvas
- Add an image element via toolbar; verify it renders on the canvas
- Add a video element via toolbar; verify it renders on the canvas
- Add a code block element via toolbar; verify it renders on the canvas
- Double-click a text element to open its edit modal; change the text and save; verify updated text on canvas
- Double-click an image element to open its edit modal; change the URL and save; verify updated image
- Double-click a video element to open its edit modal; change the URL and save; verify updated video
- Double-click a code block element to open its edit modal; change the code and save; verify updated code block
- Right-click an element; verify context menu appears with delete option; click delete; verify element is removed
- Add multiple elements; verify the most recently added element renders on top (layer ordering)
- Re-order elements via context menu (bring forward / send backward); verify z-index changes
- Open the theme/background modal; select a solid colour; verify the slide canvas background updates
- Select a gradient option; verify the slide canvas shows a gradient background
- Upload an image as background; verify the slide canvas shows the image background
- Set a default theme on the presentation; verify all slides inherit that background
- Override the default on a specific slide with a different background; verify only that slide changes while others keep the default
- Remove a per-slide override; verify the slide reverts to the default theme

---

### 2. Preview & Present Flow (`previewPresent.cy.js`)

**User Flow:** A logged-in user previews their presentation to see how it looks when presented.

**Justification:** The preview/present mode is the payoff for building slides — users need confidence that their presentation renders correctly without editor chrome (borders, selection outlines). This also validates the fullscreen experience.

**Tests:**

- Open a presentation with multiple slides and elements; click the preview/present button
- Verify the preview opens (in new tab or overlay) with all elements rendered
- Verify no element borders or editor UI appears in preview mode
- Navigate between slides in preview mode using arrow keys
- Enter fullscreen in preview; verify it fills the screen
- Exit fullscreen; verify it returns to normal preview size

---

### 3. Revision History Flow (`revisionHistory.cy.js`)

**User Flow:** A logged-in user makes changes to a presentation, then views and restores a previous version from revision history.

**Justification:** Revision history is a safety net — users need to trust they can undo destructive changes. This flow validates that history is recorded and restorable.

**Tests:**

- Make several distinct edits to a presentation (add element, rename, change background)
- Open the revision history modal; verify multiple versions are listed
- Click on an older version; verify the presentation reverts to that state
- Make a new edit after restoring; verify a new history entry is created
- Close the revision history modal; verify the modal is no longer visible