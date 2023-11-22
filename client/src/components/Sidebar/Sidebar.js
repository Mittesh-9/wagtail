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
exports.Sidebar = exports.SIDEBAR_TRANSITION_DURATION = void 0;
const React = __importStar(require("react"));
const gettext_1 = require("../../utils/gettext");
const Icon_1 = __importDefault(require("../Icon/Icon"));
// Please keep in sync with $menu-transition-duration variable in `client/scss/settings/_variables.scss`
exports.SIDEBAR_TRANSITION_DURATION = 150;
const Sidebar = ({ modules, currentPath, collapsedOnLoad = false, navigate, onExpandCollapse, }) => {
    // 'collapsed' is a persistent state that is controlled by the arrow icon at the top
    // It records the user's general preference for a collapsed/uncollapsed menu
    // This is just a hint though, and we may still collapse the menu if the screen is too small
    const [collapsed, setCollapsed] = React.useState(collapsedOnLoad);
    const mobileNavToggleRef = React.useRef(null);
    // Call onExpandCollapse(true) if menu is initialised in collapsed state
    React.useEffect(() => {
        if (collapsed && onExpandCollapse) {
            onExpandCollapse(true);
        }
    }, []);
    // 'visibleOnMobile' indicates whether the sidebar is currently visible on mobile
    // On mobile, the sidebar is completely hidden by default and must be opened manually
    const [visibleOnMobile, setVisibleOnMobile] = React.useState(false);
    // 'closedOnMobile' is used to set the menu to display none so it can no longer be interacted with by keyboard when its hidden
    const [closedOnMobile, setClosedOnMobile] = React.useState(true);
    // Tracks whether the screen is below 800 pixels. In this state, the menu is completely hidden.
    // State is used here in case the user changes their browser size
    const checkWindowSizeIsMobile = () => window.innerWidth < 800;
    const [isMobile, setIsMobile] = React.useState(checkWindowSizeIsMobile());
    React.useEffect(() => {
        function handleResize() {
            if (checkWindowSizeIsMobile()) {
                setIsMobile(true);
                return null;
            }
            setIsMobile(false);
            // Close the menu and animate out as this state is not used in desktop
            setVisibleOnMobile(false);
            // wait for animation to finish then hide menu from screen readers as well.
            return setTimeout(() => {
                setClosedOnMobile(true);
            }, exports.SIDEBAR_TRANSITION_DURATION);
        }
        window.addEventListener('resize', handleResize);
        const closeTimeout = handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
            if (closeTimeout) {
                clearTimeout(closeTimeout);
            }
        };
    }, []);
    // Whether or not to display the menu with slim layout.
    const slim = collapsed && !isMobile;
    // 'expandingOrCollapsing' is set to true whilst the menu is transitioning between slim and expanded layouts
    const [expandingOrCollapsing, setExpandingOrCollapsing] = React.useState(false);
    React.useEffect(() => {
        setExpandingOrCollapsing(true);
        const finishTimeout = setTimeout(() => {
            setExpandingOrCollapsing(false);
        }, exports.SIDEBAR_TRANSITION_DURATION);
        return () => {
            clearTimeout(finishTimeout);
        };
    }, [slim]);
    const onClickCollapseToggle = () => {
        setCollapsed(!collapsed);
        if (onExpandCollapse) {
            onExpandCollapse(!collapsed);
        }
    };
    const onClickOpenCloseToggle = () => {
        setVisibleOnMobile(!visibleOnMobile);
        setExpandingOrCollapsing(true);
        const finishTimeout = setTimeout(() => {
            setExpandingOrCollapsing(false);
            setClosedOnMobile(!closedOnMobile);
        }, exports.SIDEBAR_TRANSITION_DURATION);
        return () => {
            clearTimeout(finishTimeout);
        };
    };
    const [focused, setFocused] = React.useState(false);
    const onBlurHandler = () => {
        if (focused) {
            setFocused(false);
            setCollapsed(true);
        }
    };
    const onFocusHandler = () => {
        if (focused) {
            setCollapsed(false);
            setFocused(true);
        }
    };
    const onSearchClick = () => {
        if (slim) {
            onClickCollapseToggle();
        }
    };
    React.useEffect(() => {
        // wait for animation to finish then hide menu from screen readers as well.
        const finishHidingMenu = setTimeout(() => {
            if (!visibleOnMobile) {
                setClosedOnMobile(true);
            }
        }, exports.SIDEBAR_TRANSITION_DURATION);
        return () => {
            clearTimeout(finishHidingMenu);
        };
    }, [visibleOnMobile]);
    const onHideMobile = () => {
        var _a;
        setVisibleOnMobile(false);
        if (mobileNavToggleRef) {
            // When menu is closed with escape key bring focus back to open close toggle
            (_a = mobileNavToggleRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    // Render modules
    const renderedModules = modules.map((module, index) => module.render({
        key: index,
        slim,
        expandingOrCollapsing,
        onHideMobile,
        onSearchClick,
        currentPath,
        navigate,
    }));
    return (<>
      <button onClick={onClickOpenCloseToggle} aria-label={(0, gettext_1.gettext)('Toggle sidebar')} aria-expanded={visibleOnMobile ? 'true' : 'false'} className={'button sidebar-nav-toggle' +
            (isMobile ? ' sidebar-nav-toggle--mobile' : '') +
            (visibleOnMobile ? ' sidebar-nav-toggle--open' : '')} type="button" ref={mobileNavToggleRef}>
        {visibleOnMobile ? <Icon_1.default name="cross"/> : <Icon_1.default name="bars"/>}
      </button>
      <div className={'sidebar' +
            (slim ? ' sidebar--slim' : '') +
            (isMobile ? ' sidebar--mobile' : '') +
            (isMobile && !visibleOnMobile ? ' sidebar--hidden' : '') +
            (isMobile && !visibleOnMobile && closedOnMobile
                ? ' sidebar--closed'
                : '')}>
        <div className="sidebar__inner" onFocus={onFocusHandler} onBlur={onBlurHandler}>
          <div className={`sm:w-mt-2 ${slim ? 'w-justify-center' : 'w-justify-end'} w-flex  w-items-center`}>
            <button onClick={onClickCollapseToggle} aria-label={(0, gettext_1.gettext)('Toggle sidebar')} aria-expanded={slim ? 'false' : 'true'} type="button" className={`${!slim ? 'w-mr-4' : ''}
                button
                sidebar__collapse-toggle
                w-flex
                w-justify-center
                w-items-center
                hover:w-bg-surface-menu-item-active
                hover:text-white
                hover:opacity-100`}>
              <Icon_1.default name="expand-right" className={!collapsed ? '-w-rotate-180' : ''}/>
            </button>
          </div>

          {renderedModules}
        </div>
      </div>
    </>);
};
exports.Sidebar = Sidebar;
