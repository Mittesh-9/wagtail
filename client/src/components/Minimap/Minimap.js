"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const debounce_1 = require("../../utils/debounce");
const gettext_1 = require("../../utils/gettext");
const panels_1 = require("../../includes/panels");
const Icon_1 = __importDefault(require("../Icon/Icon"));
const CollapseAll_1 = __importDefault(require("./CollapseAll"));
const MinimapItem_1 = __importDefault(require("./MinimapItem"));
const observerOptions = {
    root: null,
    // Count an element as "in", accounting for the 50px slim header and 70px actions footer.
    rootMargin: '-50px 0px -70px 0px',
    // 10% visibility within the boxed viewport is enough.
    threshold: 0.1,
};
const mapIntersections = (acc, { target, isIntersecting }) => {
    var _a;
    const href = `#${(_a = target.closest('[data-panel]')) === null || _a === void 0 ? void 0 : _a.id}` || '';
    acc[href] = isIntersecting;
    return acc;
};
/**
 * For cases where the minimap has more item than can fit in the viewport,
 * we need to keep its scroll position updated to follow page scrolling.
 */
const updateScrollPosition = (list) => {
    const activeLinks = list.querySelectorAll('a[aria-current="true"]');
    // Don’t update the scroll position if there are no links, or all links are visible.
    if (activeLinks.length === 0 || list.scrollHeight === list.clientHeight) {
        return;
    }
    const firstActive = activeLinks[0];
    const lastActive = activeLinks[activeLinks.length - 1];
    let newScroll = list.scrollTop;
    if (firstActive) {
        if (firstActive.offsetTop < list.scrollTop) {
            newScroll = firstActive.offsetTop;
        }
    }
    if (lastActive) {
        if (lastActive.offsetTop > list.scrollTop + list.offsetHeight) {
            newScroll =
                lastActive.offsetTop - list.offsetHeight + lastActive.offsetHeight;
        }
    }
    // Scroll changes require mutating this property.
    // eslint-disable-next-line no-param-reassign
    list.scrollTop = newScroll;
};
const getInitialMinimapExpanded = () => {
    let saved = 'false';
    try {
        saved = localStorage.getItem('wagtail:minimap-expanded') || saved;
    }
    catch (_a) {
        // Use the default if localStorage isn’t available.
    }
    return saved === 'true';
};
/**
 * Minimap sidebar menu, with one internal link per section of the page.
 * The minimap has a lot of advanced behavior:
 * - It opens and closes based on hover, except if interacted with.
 * - It also opens and closes when clicking its toggle.
 * - It closes when clicking outside.
 * - It uses IntersectionObserver to display which menu items are currently "visible" on the page.
 */
const Minimap = ({ container, anchorsContainer, links, onUpdate, toggleAllPanels, }) => {
    const initialExpanded = (0, react_1.useMemo)(() => getInitialMinimapExpanded(), []);
    const [expanded, setExpanded] = (0, react_1.useState)(initialExpanded);
    const toggleMinimap = (0, react_1.useCallback)((newExpanded = !expanded) => {
        setExpanded(newExpanded);
        document.body.classList.toggle('minimap-open', newExpanded);
        try {
            localStorage.setItem('wagtail:minimap-expanded', newExpanded ? 'true' : 'false');
        }
        catch (_a) {
            // Skip saving the preference if localStorage isn’t available.
        }
    }, [expanded, setExpanded]);
    // Collapse all yes/no state.
    const [panelsExpanded, setPanelsExpanded] = (0, react_1.useState)(true);
    const [intersections, setIntersections] = (0, react_1.useState)({});
    const observer = (0, react_1.useRef)(null);
    const lastIntersections = (0, react_1.useRef)({});
    const updateLinks = (0, react_1.useRef)(null);
    const listRef = (0, react_1.useRef)(null);
    const onClickToggle = () => toggleMinimap(!expanded);
    const onClickLink = (link, e) => {
        // Prevent navigating if the link is only partially shown.
        if (!expanded) {
            e.preventDefault();
        }
        (0, panels_1.toggleCollapsiblePanel)(link.toggle, true);
        toggleMinimap(true);
    };
    (0, react_1.useEffect)(() => {
        // Sync the body class with the initial expanded state.
        toggleMinimap(initialExpanded);
    }, []);
    /**
     * Performance-sensitive intersections calculations with a double debounce:
     * - With the IntersectionObserver API, the browser decides how often to update us, compared to constant `scroll`.
     * - We keep track of intersecting elements on every IntersectionObserver update,
     * - but only update the links after updates have stopped for 100ms.
     */
    (0, react_1.useEffect)(() => {
        const obsCallback = (newEntries) => {
            lastIntersections.current = newEntries.reduce(mapIntersections, Object.assign({}, lastIntersections.current));
            if (!updateLinks.current) {
                updateLinks.current = (0, debounce_1.debounce)((newIntersections) => {
                    setIntersections(newIntersections);
                    updateScrollPosition(listRef.current);
                }, 100);
            }
            updateLinks.current(lastIntersections.current);
            // Support for InlinePanel removals: when they stop intersecting, re-render the whole minimap.
            newEntries.forEach(({ target }) => {
                const deletedInlinePanel = target.closest('.deleted');
                if (deletedInlinePanel) {
                    onUpdate(container);
                }
            });
        };
        if (!observer.current) {
            observer.current = new IntersectionObserver(obsCallback, observerOptions);
        }
        const obs = observer.current;
        obs.disconnect();
        links.forEach(({ panel, toggle }) => {
            // Special-case for top-level InlinePanel and StreamField, where the
            // link only shows as active if the anchor is in view.
            const isTopLevelNested = panel.matches('.w-panel--nested') &&
                panel.closest('[data-field]') === null;
            obs.observe(isTopLevelNested ? toggle : panel);
        });
        return () => {
            obs.disconnect();
        };
    }, [links, container]);
    (0, react_1.useEffect)(() => {
        // Reset the "collapse all" when switching tabs.
        setPanelsExpanded(true);
    }, [anchorsContainer, setPanelsExpanded]);
    return (<div>
      <CollapseAll_1.default expanded={panelsExpanded} onClick={() => {
            setPanelsExpanded(!panelsExpanded);
            toggleAllPanels(!panelsExpanded);
        }} floating insideMinimap={expanded}/>
      <div className={`w-minimap ${expanded ? 'w-minimap--expanded' : ''}`}>
        <div className="w-minimap__header">
          <button id="w-minimap-toggle" type="button" aria-expanded={expanded} onClick={onClickToggle} className="w-minimap__toggle" 
    // Not the most correct label, but matches side panels with similar toggles.
    aria-label={(0, gettext_1.gettext)('Toggle side panel')}>
            <Icon_1.default name="expand-right"/>
          </button>
        </div>
        <ol className="w-minimap__list" ref={listRef}>
          {links.map((link) => (<li key={link.href}>
              <MinimapItem_1.default item={link} intersects={intersections[link.href]} expanded={expanded} onClick={onClickLink}/>
            </li>))}
        </ol>
        <div className="w-minimap__footer"/>
      </div>
    </div>);
};
exports.default = Minimap;
