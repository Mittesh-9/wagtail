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
exports.SubMenuItemDefinition = exports.SubMenuItem = void 0;
const React = __importStar(require("react"));
const react_1 = __importDefault(require("@tippyjs/react"));
const Icon_1 = __importDefault(require("../../Icon/Icon"));
const MainMenu_1 = require("../modules/MainMenu");
const SidebarPanel_1 = require("../SidebarPanel");
const Sidebar_1 = require("../Sidebar");
const gettext_1 = require("../../../utils/gettext");
const SubMenuItem = ({ path, item, slim, state, dispatch, navigate, }) => {
    const isOpen = state.navigationPath.startsWith(path);
    const isActive = isOpen || state.activePath.startsWith(path);
    const depth = path.split('.').length;
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
    const dismissibleCount = item.menuItems.filter((subItem) => !(0, MainMenu_1.isDismissed)(subItem, state)).length;
    React.useEffect(() => {
        if (isOpen) {
            // isOpen is set at the moment the user clicks the menu item
            setIsVisible(true);
        }
        else if (!isOpen && isVisible) {
            // When a submenu is closed, we have to wait for the close animation
            // to finish before making it invisible
            setTimeout(() => {
                setIsVisible(false);
            }, Sidebar_1.SIDEBAR_TRANSITION_DURATION);
        }
    }, [isOpen]);
    const onClick = () => {
        // Only dispatch set-dismissible-state when there are dismissible items
        // in the submenu and the submenu has not been opened before. Note that
        // the term "submenu" for this component means that this menu item *has*
        // "sub" items (children), rather than the actual "sub" menu items inside it.
        if (!hasBeenOpened && dismissibleCount > 0) {
            // Dispatching set-dismissible-state from this submenu also collect
            // all dismissible items in the submenu and set their state to dismissed
            // on the server, so that those child items won't show up as "new" again on
            // the next load.
            // However, the client state for the child items is only updated on the
            // next reload or if the individual items are clicked, so that the user
            // has the chance to see the "new" badge for those items.
            // After clicking this at least once, even if hasBeenOpened is false on
            // the next load, all the child items have been dismissed (dismissibleCount == 0),
            // so the "new" badge will not show up again (unless the server adds a new item).
            dispatch({
                type: 'set-dismissible-state',
                item,
            });
        }
        if (isOpen) {
            const pathComponents = path.split('.');
            pathComponents.pop();
            const parentPath = pathComponents.join('.');
            dispatch({
                type: 'set-navigation-path',
                path: parentPath,
            });
        }
        else {
            dispatch({
                type: 'set-navigation-path',
                path,
            });
            setHasBeenOpened(true);
        }
    };
    const className = 'sidebar-menu-item sidebar-sub-menu-item' +
        (isActive ? ' sidebar-menu-item--active' : '') +
        (isOpen ? ' sidebar-sub-menu-item--open' : '');
    const sidebarTriggerIconClassName = 'sidebar-sub-menu-trigger-icon' +
        (isOpen ? ' sidebar-sub-menu-trigger-icon--open' : '');
    return (<li className={className}>
      <react_1.default disabled={isOpen || !slim} content={item.label} placement="right">
        <button {...item.attrs} onClick={onClick} className={`sidebar-menu-item__link ${item.classNames}`} aria-haspopup="menu" aria-expanded={isOpen ? 'true' : 'false'} type="button">
          {item.iconName && (<Icon_1.default name={item.iconName} className="icon--menuitem"/>)}
          <span className="menuitem-label">{item.label}</span>

          {
        // Only show the dismissible badge if the menu item has not been
        // opened yet, so it's less distracting after the user has opened it.
        }
          {dismissibleCount > 0 && !hasBeenOpened && (<span className="w-dismissible-badge w-dismissible-badge--count">
              <span aria-hidden="true">{dismissibleCount}</span>
              <span className="w-sr-only">
                {dismissibleCount === 1
                ? (0, gettext_1.gettext)('(1 new item in this menu)')
                : (0, gettext_1.gettext)('(%(number)s new items in this menu)').replace('%(number)s', `${dismissibleCount}`)}
              </span>
            </span>)}
          <Icon_1.default className={sidebarTriggerIconClassName} name="arrow-right"/>
        </button>
      </react_1.default>
      <SidebarPanel_1.SidebarPanel isVisible={isVisible} isOpen={isOpen} depth={depth}>
        <div className="sidebar-sub-menu-panel">
          <h2 id={`wagtail-sidebar-submenu${path.split('.').join('-')}-title`} className={`${item.classNames} w-h4`}>
            {item.iconName && (<Icon_1.default name={item.iconName} className="icon--submenu-header"/>)}
            {item.label}
          </h2>
          <ul aria-labelledby={`wagtail-sidebar-submenu${path
            .split('.')
            .join('-')}-title`}>
            {(0, MainMenu_1.renderMenu)(path, item.menuItems, slim, state, dispatch, navigate)}
          </ul>
          {item.footerText && (<p className="sidebar-sub-menu-panel__footer">{item.footerText}</p>)}
        </div>
      </SidebarPanel_1.SidebarPanel>
    </li>);
};
exports.SubMenuItem = SubMenuItem;
class SubMenuItemDefinition {
    constructor({ name, label, attrs, icon_name: iconName = null, classname = undefined, footer_text: footerText = '', }, menuItems) {
        this.name = name;
        this.label = label;
        this.menuItems = menuItems;
        this.attrs = attrs;
        this.iconName = iconName;
        this.classNames = classname;
        this.footerText = footerText;
    }
    render({ path, slim, state, dispatch, navigate }) {
        return (<exports.SubMenuItem key={this.name} item={this} path={path} slim={slim} state={state} dispatch={dispatch} navigate={navigate}/>);
    }
}
exports.SubMenuItemDefinition = SubMenuItemDefinition;
