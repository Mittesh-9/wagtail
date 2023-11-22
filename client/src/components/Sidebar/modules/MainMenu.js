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
exports.MainMenuModuleDefinition = exports.Menu = exports.isDismissed = exports.renderMenu = void 0;
const React = __importStar(require("react"));
const react_1 = __importDefault(require("@tippyjs/react"));
const gettext_1 = require("../../../utils/gettext");
const Icon_1 = __importDefault(require("../../Icon/Icon"));
const LinkMenuItem_1 = require("../menu/LinkMenuItem");
const SubMenuItem_1 = require("../menu/SubMenuItem");
const DismissibleController_1 = require("../../../controllers/DismissibleController");
function renderMenu(path, items, slim, state, dispatch, navigate) {
    return (<>
      {items.map((item) => item.render({
            path: `${path}.${item.name}`,
            slim,
            state,
            dispatch,
            navigate,
        }))}
    </>);
}
exports.renderMenu = renderMenu;
function isDismissed(item, state) {
    return (
    // Non-dismissibles are considered as dismissed
    !item.attrs['data-w-dismissible-id-value'] ||
        // Dismissed on the server
        'data-w-dismissible-dismissed-value' in item.attrs ||
        // Dismissed on the client
        state.dismissibles[item.name]);
}
exports.isDismissed = isDismissed;
function walkDismissibleMenuItems(menuItems, action) {
    menuItems.forEach((menuItem) => {
        const id = menuItem.attrs['data-w-dismissible-id-value'];
        if (id) {
            action(menuItem);
        }
        if (menuItem instanceof SubMenuItem_1.SubMenuItemDefinition) {
            walkDismissibleMenuItems(menuItem.menuItems, action);
        }
    });
}
function computeDismissibleState(state, { item, value = true }) {
    const update = {};
    // Recursively update all dismissible items
    walkDismissibleMenuItems([item], (menuItem) => {
        update[menuItem.attrs['data-w-dismissible-id-value']] = value;
    });
    // Send the update to the server
    if (Object.keys(update).length > 0) {
        (0, DismissibleController_1.updateDismissibles)(update);
    }
    // Only update the top-level item in the client state so that the submenus
    // are not immediately dismissed until the next page load
    return Object.assign(Object.assign({}, state.dismissibles), { [item.name]: value });
}
function menuReducer(state, action) {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'set-active-path':
            newState.activePath = action.path;
            break;
        case 'set-navigation-path':
            newState.navigationPath = action.path;
            break;
        case 'set-dismissible-state':
            newState.dismissibles = computeDismissibleState(state, action);
            break;
        default:
            break;
    }
    return newState;
}
function getInitialDismissibleState(menuItems) {
    const result = {};
    walkDismissibleMenuItems(menuItems, (menuItem) => {
        result[menuItem.attrs['data-w-dismissible-id-value']] =
            'data-w-dismissible-dismissed-value' in menuItem.attrs;
    });
    return result;
}
const Menu = ({ menuItems, accountMenuItems, user, expandingOrCollapsing, onHideMobile, slim, currentPath, navigate, }) => {
    // navigationPath and activePath are two dot-delimited path's referencing a menu item
    // They are created by concatenating the name fields of all the menu/sub-menu items leading to the relevant one.
    // For example, the "Users" item in the "Settings" sub-menu would have the path 'settings.users'
    // - navigationPath references the current sub-menu that the user currently has open
    // - activePath references the menu item for the page the user is currently on
    const [state, dispatch] = React.useReducer(menuReducer, {
        navigationPath: '',
        activePath: '',
        dismissibles: getInitialDismissibleState(menuItems),
    });
    const isVisible = !slim || expandingOrCollapsing;
    const accountSettingsOpen = state.navigationPath.startsWith('.account');
    React.useEffect(() => {
        // Force account navigation to closed state when in slim mode
        if (slim && accountSettingsOpen) {
            dispatch({
                type: 'set-navigation-path',
                path: '',
            });
        }
    }, [slim]);
    // Whenever currentPath or menu changes, work out new activePath
    React.useEffect(() => {
        const urlPathsToNavigationPaths = [];
        const walkMenu = (path, walkingMenuItems) => {
            walkingMenuItems.forEach((item) => {
                const newPath = `${path}.${item.name}`;
                if (item instanceof LinkMenuItem_1.LinkMenuItemDefinition) {
                    urlPathsToNavigationPaths.push([item.url, newPath]);
                }
                else if (item instanceof SubMenuItem_1.SubMenuItemDefinition) {
                    walkMenu(newPath, item.menuItems);
                }
            });
        };
        walkMenu('', menuItems);
        walkMenu('', accountMenuItems);
        let bestMatch = null;
        urlPathsToNavigationPaths.forEach(([urlPath, navPath]) => {
            if (currentPath.startsWith(urlPath)) {
                if (bestMatch == null || urlPath.length > bestMatch[0].length) {
                    bestMatch = [urlPath, navPath];
                }
            }
        });
        const newActivePath = bestMatch ? bestMatch[1] : '';
        if (newActivePath !== state.activePath) {
            dispatch({
                type: 'set-active-path',
                path: newActivePath,
            });
        }
    }, [currentPath, menuItems]);
    React.useEffect(() => {
        // Close submenus when user presses escape
        const onKeydown = (e) => {
            if (e.key === 'Escape') {
                dispatch({
                    type: 'set-navigation-path',
                    path: '',
                });
                if (state.navigationPath === '') {
                    onHideMobile();
                }
            }
        };
        const onClickOutside = (e) => {
            const sidebar = document.querySelector('[data-wagtail-sidebar]');
            const isInside = sidebar && sidebar.contains(e.target);
            if (!isInside) {
                dispatch({
                    type: 'set-navigation-path',
                    path: '',
                });
            }
        };
        document.addEventListener('keydown', onKeydown);
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('touchend', onClickOutside);
        return () => {
            document.removeEventListener('keydown', onKeydown);
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('touchend', onClickOutside);
        };
    }, []);
    const onClickAccountSettings = () => {
        // Pass account expand information to Sidebar component
        if (accountSettingsOpen) {
            dispatch({
                type: 'set-navigation-path',
                path: '',
            });
        }
        else {
            dispatch({
                type: 'set-navigation-path',
                path: '.account',
            });
        }
    };
    const className = 'sidebar-main-menu w-scrollbar-thin' +
        (accountSettingsOpen ? ' sidebar-main-menu--open-footer' : '');
    return (<>
      <nav className={className} aria-label={(0, gettext_1.gettext)('Main menu')}>
        <ul className="sidebar-main-menu__list">
          {renderMenu('', menuItems, slim, state, dispatch, navigate)}
        </ul>
      </nav>
      <div className={'sidebar-footer' +
            (accountSettingsOpen ? ' sidebar-footer--open' : '') +
            (isVisible ? ' sidebar-footer--visible' : '')}>
        <react_1.default disabled={!slim} content={user.name} placement="right">
          <button className={`
            ${slim ? 'w-px-4' : 'w-px-5'}
            sidebar-footer__account
            w-bg-surface-menus
            w-text-text-label-menus-default
            w-flex
            w-items-center
            w-relative
            w-w-full
            w-appearance-none
            w-border-0
            w-overflow-hidden
            w-py-3
            hover:w-bg-surface-menu-item-active
            focus:w-bg-surface-menu-item-active
            w-transition`} title={(0, gettext_1.gettext)('Edit your account')} onClick={onClickAccountSettings} aria-label={(0, gettext_1.gettext)('Edit your account')} aria-haspopup="menu" aria-expanded={accountSettingsOpen ? 'true' : 'false'} type="button">
            <div className="avatar avatar-on-dark w-flex-shrink-0 !w-w-[28px] !w-h-[28px]">
              <img src={user.avatarUrl} alt="" decoding="async" loading="lazy"/>
            </div>
            <div className="sidebar-footer__account-toggle">
              <div className="sidebar-footer__account-label w-label-3">
                {user.name}
              </div>
              <Icon_1.default className="w-w-4 w-h-4 w-text-text-label-menus-default" name={accountSettingsOpen ? 'arrow-down' : 'arrow-up'}/>
            </div>
          </button>
        </react_1.default>

        <ul>
          {renderMenu('', accountMenuItems, slim, state, dispatch, navigate)}
        </ul>
      </div>
    </>);
};
exports.Menu = Menu;
class MainMenuModuleDefinition {
    constructor(menuItems, accountMenuItems, user) {
        this.menuItems = menuItems;
        this.accountMenuItems = accountMenuItems;
        this.user = user;
    }
    render({ slim, expandingOrCollapsing, onHideMobile, key, currentPath, navigate, }) {
        return (<exports.Menu menuItems={this.menuItems} accountMenuItems={this.accountMenuItems} user={this.user} slim={slim} expandingOrCollapsing={expandingOrCollapsing} onHideMobile={onHideMobile} key={key} currentPath={currentPath} navigate={navigate}/>);
    }
}
exports.MainMenuModuleDefinition = MainMenuModuleDefinition;
