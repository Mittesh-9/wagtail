"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMinimap = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const panels_1 = require("../../includes/panels");
const debounce_1 = require("../../utils/debounce");
const Minimap_1 = __importDefault(require("./Minimap"));
/**
 * Generate a minimap link’s data, based on the panel’s elements.
 */
const createMinimapLink = (anchor) => {
    var _a, _b;
    const panel = anchor.closest('[data-panel]');
    const headingId = panel === null || panel === void 0 ? void 0 : panel.getAttribute('aria-labelledby');
    const heading = panel === null || panel === void 0 ? void 0 : panel.querySelector(`#${headingId}`);
    const toggle = panel === null || panel === void 0 ? void 0 : panel.querySelector('[data-panel-toggle]');
    // Special case for InlinePanel, where deleted items are kept until the form is saved.
    const inlinePanelDeleted = anchor.closest('[data-inline-panel-child].deleted');
    if (!panel || !heading || !toggle || inlinePanelDeleted) {
        return null;
    }
    const headingText = heading.querySelector('[data-panel-heading-text]');
    // If the heading’s most correct text content is unavailable (StreamField block collapsed when empty),
    // fall back to the full heading text.
    const label = (headingText === null || headingText === void 0 ? void 0 : headingText.textContent) ||
        ((_a = heading.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\s+\*\s+$/g, '').trim());
    const required = panel.querySelector('[data-panel-required]') !== null;
    const useElt = toggle.querySelector('use');
    const icon = ((_b = useElt === null || useElt === void 0 ? void 0 : useElt.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.replace('#icon-', '')) || '';
    const ariaLevel = heading.getAttribute('aria-level');
    const headingLevel = `h${ariaLevel || heading.tagName[1] || 2}`;
    const errorCount = [].slice
        .call(panel.querySelectorAll('.error-message'))
        .filter((err) => err.closest('[data-panel]') === panel).length;
    return {
        anchor,
        toggle,
        panel,
        icon,
        label: label || '',
        // Use the attribute rather than property so we only have a hash.
        href: anchor.getAttribute('href') || '',
        required,
        errorCount,
        level: headingLevel,
    };
};
/**
 * Render the minimap component within a given element.
 * Populates the minimap with the relevant links based on currently-visible collapsible panels.
 */
const renderMinimap = (container) => {
    let anchorsContainer = document.body;
    const tabs = document.querySelector('[data-tabs]');
    // Render the minimap based on the active tab when there are tabs.
    if (tabs) {
        const activeTab = tabs.querySelector('[role="tab"][aria-selected="true"]');
        const panelId = activeTab === null || activeTab === void 0 ? void 0 : activeTab.getAttribute('aria-controls');
        const activeTabpanel = tabs.querySelector(`#${panelId}`);
        anchorsContainer = activeTabpanel || anchorsContainer;
    }
    const anchors = anchorsContainer.querySelectorAll('[data-panel-anchor]');
    const links = [].slice
        .call(anchors)
        .map(createMinimapLink)
        .filter(Boolean);
    const toggleAllPanels = (expanded) => {
        links.forEach((link, i) => {
            // Avoid collapsing the title field, where the collapse toggle is hidden.
            const isTitle = i === 0 && link.href.includes('title');
            if (!isTitle) {
                (0, panels_1.toggleCollapsiblePanel)(link.toggle, expanded);
            }
        });
    };
    react_dom_1.default.render(<Minimap_1.default container={container} anchorsContainer={anchorsContainer} links={links} onUpdate={renderMinimap} toggleAllPanels={toggleAllPanels}/>, container);
};
/**
 * Initialise the minimap within the target element,
 * making sure it re-renders when the visible content changes.
 */
const initMinimap = (container = document.querySelector('[data-minimap-container]')) => {
    if (!container) {
        return;
    }
    const updateMinimap = (0, debounce_1.debounce)(renderMinimap.bind(null, container), 100);
    document.addEventListener('wagtail:tab-changed', updateMinimap);
    document.addEventListener('wagtail:panel-init', updateMinimap);
    // Make sure the positioning of the minimap is always correct.
    const setOffsetTop = () => container.style.setProperty('--offset-top', `${container.offsetTop}px`);
    const updateOffsetTop = (0, debounce_1.debounce)(setOffsetTop, 100);
    document.addEventListener('resize', updateOffsetTop);
    setOffsetTop();
    updateMinimap(container);
};
exports.initMinimap = initMinimap;
