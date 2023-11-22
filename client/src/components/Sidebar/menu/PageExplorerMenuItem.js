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
exports.PageExplorerMenuItemDefinition = exports.PageExplorerMenuItem = void 0;
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_1 = __importDefault(require("@tippyjs/react"));
const Icon_1 = __importDefault(require("../../Icon/Icon"));
const LinkMenuItem_1 = require("./LinkMenuItem");
const PageExplorer_1 = __importStar(require("../../PageExplorer"));
const actions_1 = require("../../PageExplorer/actions");
const SidebarPanel_1 = require("../SidebarPanel");
const Sidebar_1 = require("../Sidebar");
const PageExplorerMenuItem = ({ path, slim, item, state, dispatch, navigate }) => {
    const isOpen = state.navigationPath.startsWith(path);
    const isActive = isOpen || state.activePath.startsWith(path);
    const depth = path.split('.').length;
    const isInSubMenu = path.split('.').length > 2;
    const [isVisible, setIsVisible] = React.useState(false);
    const store = React.useRef(null);
    if (!store.current) {
        store.current = (0, PageExplorer_1.initPageExplorerStore)();
    }
    const onCloseExplorer = () => {
        // When a submenu is closed, we have to wait for the close animation
        // to finish before making it invisible
        setTimeout(() => {
            setIsVisible(false);
            if (store.current) {
                store.current.dispatch((0, actions_1.closePageExplorer)());
            }
        }, Sidebar_1.SIDEBAR_TRANSITION_DURATION);
    };
    React.useEffect(() => {
        if (isOpen) {
            // isOpen is set at the moment the user clicks the menu item
            setIsVisible(true);
            if (store.current) {
                store.current.dispatch((0, actions_1.openPageExplorer)(item.startPageId));
            }
        }
        else if (!isOpen && isVisible) {
            onCloseExplorer();
        }
    }, [isOpen]);
    const onClick = () => {
        // Open/close explorer
        if (isOpen) {
            dispatch({
                type: 'set-navigation-path',
                path: '',
            });
        }
        else {
            dispatch({
                type: 'set-navigation-path',
                path,
            });
        }
    };
    const className = 'sidebar-menu-item sidebar-page-explorer-item' +
        (isActive ? ' sidebar-menu-item--active' : '') +
        (isInSubMenu ? ' sidebar-menu-item--in-sub-menu' : '');
    const sidebarTriggerIconClassName = 'sidebar-sub-menu-trigger-icon' +
        (isOpen ? ' sidebar-sub-menu-trigger-icon--open' : '');
    return (<li className={className}>
      <react_1.default disabled={isOpen || !slim} content={item.label} placement="right">
        <button onClick={onClick} className="sidebar-menu-item__link" aria-haspopup="dialog" aria-expanded={isOpen ? 'true' : 'false'} type="button">
          <Icon_1.default name="folder-open-inverse" className="icon--menuitem"/>
          <span className="menuitem-label">{item.label}</span>
          <Icon_1.default className={sidebarTriggerIconClassName} name="arrow-right"/>
        </button>
      </react_1.default>
      <div>
        <SidebarPanel_1.SidebarPanel isVisible={isVisible} isOpen={isOpen} depth={depth} widthPx={485}>
          {store.current && (<react_redux_1.Provider store={store.current}>
              <PageExplorer_1.default isVisible={isVisible} navigate={navigate} onClose={onCloseExplorer}/>
            </react_redux_1.Provider>)}
        </SidebarPanel_1.SidebarPanel>
      </div>
    </li>);
};
exports.PageExplorerMenuItem = PageExplorerMenuItem;
class PageExplorerMenuItemDefinition extends LinkMenuItem_1.LinkMenuItemDefinition {
    constructor({ name, label, url, attrs, icon_name: iconName = null, classname = undefined, }, startPageId) {
        super({ name, label, url, attrs, icon_name: iconName, classname });
        this.startPageId = startPageId;
    }
    render({ path, slim, state, dispatch, navigate }) {
        return (<exports.PageExplorerMenuItem key={this.name} item={this} path={path} slim={slim} state={state} dispatch={dispatch} navigate={navigate}/>);
    }
}
exports.PageExplorerMenuItemDefinition = PageExplorerMenuItemDefinition;
