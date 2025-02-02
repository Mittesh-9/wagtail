"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAnchoredPanels = exports.initCollapsiblePanels = exports.initCollapsiblePanel = exports.toggleCollapsiblePanel = void 0;
/**
 * Switches a collapsible panel from expanded to collapsed, or vice versa.
 * Updates the DOM and fires custom events for other code to hook into.
 */
const toggleCollapsiblePanel = (toggle, 
// If a specific state isn’t requested, read the DOM and toggle.
isExpanding = !(toggle.getAttribute('aria-expanded') === 'true')) => {
    const content = document.querySelector(`#${toggle.getAttribute('aria-controls')}`);
    if (!content) {
        return;
    }
    toggle.setAttribute('aria-expanded', `${isExpanding}`);
    if (isExpanding) {
        content.removeAttribute('hidden');
    }
    else if ('onbeforematch' in document.body) {
        // Use experimental `until-found` value, so users can search inside the panels.
        content.setAttribute('hidden', 'until-found');
    }
    else {
        // Browsers without support for `until-found` will not have this value set
        content.setAttribute('hidden', '');
    }
    // Fire events on the toggle so we can retrieve the content with aria-controls.
    toggle.dispatchEvent(new CustomEvent('commentAnchorVisibilityChange', { bubbles: true }));
    toggle.dispatchEvent(new CustomEvent('wagtail:panel-toggle', {
        bubbles: true,
        cancelable: false,
        detail: { expanded: isExpanding },
    }));
};
exports.toggleCollapsiblePanel = toggleCollapsiblePanel;
/**
 * Initialises event handlers for a collapsible panel,
 * and applies the correct initial state based on classes.
 */
function initCollapsiblePanel(toggle) {
    const panel = toggle.closest('[data-panel]');
    const content = document.querySelector(`#${toggle.getAttribute('aria-controls')}`);
    // Avoid initialising the same panel twice.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!content || !panel || panel.collapsibleInitialised) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    panel.collapsibleInitialised = true;
    const togglePanel = exports.toggleCollapsiblePanel.bind(null, toggle);
    // Collapse panels marked as `collapsed`, unless they contain invalid fields.
    const hasCollapsed = panel.classList.contains('collapsed');
    const hasError = content.querySelector('[aria-invalid="true"], .error, .w-field--error');
    const isCollapsed = hasCollapsed && !hasError;
    if (isCollapsed) {
        togglePanel(false);
    }
    toggle.addEventListener('click', togglePanel.bind(null, undefined));
    const heading = panel.querySelector('[data-panel-heading]');
    if (heading) {
        heading.addEventListener('click', togglePanel.bind(null, undefined));
    }
    // Set the toggle back to expanded upon reveal.
    content.addEventListener('beforematch', togglePanel.bind(null, true));
    toggle.dispatchEvent(new CustomEvent('wagtail:panel-init', {
        bubbles: true,
        cancelable: false,
        detail: { expanded: !isCollapsed },
    }));
}
exports.initCollapsiblePanel = initCollapsiblePanel;
/**
 * Make panels collapsible, and collapse panels already marked as `collapsed`.
 */
function initCollapsiblePanels(toggles = document.querySelectorAll('[data-panel-toggle]')) {
    toggles.forEach(initCollapsiblePanel);
}
exports.initCollapsiblePanels = initCollapsiblePanels;
/**
 * Smooth scroll onto any active panel.
 * Needs to run after the whole page is loaded so the browser can resolve any
 * JS-rendered :target.
 */
function initAnchoredPanels(anchorTarget = document.querySelector('[data-panel]:target')) {
    if (anchorTarget) {
        anchorTarget.scrollIntoView({ behavior: 'smooth' });
    }
}
exports.initAnchoredPanels = initAnchoredPanels;
