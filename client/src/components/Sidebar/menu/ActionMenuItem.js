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
exports.ActionMenuItemDefinition = exports.ActionMenuItem = void 0;
const React = __importStar(require("react"));
const react_1 = __importDefault(require("@tippyjs/react"));
const Icon_1 = __importDefault(require("../../Icon/Icon"));
const gettext_1 = require("../../../utils/gettext");
const MainMenu_1 = require("../modules/MainMenu");
const wagtailConfig_1 = require("../../../config/wagtailConfig");
const ActionMenuItem = ({ item, slim, path, state, dispatch }) => {
    const isActive = state.activePath.startsWith(path);
    const isInSubMenu = path.split('.').length > 2;
    const onClick = (e) => {
        // Do not capture click events with modifier keys or non-main buttons.
        if (e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button !== 0)) {
            return;
        }
        if (!(0, MainMenu_1.isDismissed)(item, state)) {
            dispatch({
                type: 'set-dismissible-state',
                item,
            });
        }
    };
    const className = 'sidebar-menu-item' +
        (isActive ? ' sidebar-menu-item--active' : '') +
        (isInSubMenu ? ' sidebar-menu-item--in-sub-menu' : '');
    return (<li className={className}>
      <react_1.default disabled={!slim || isInSubMenu} content={item.label} placement="right">
        <form {...item.attrs} method={item.method} action={item.action}>
          <input type="hidden" name="csrfmiddlewaretoken" value={wagtailConfig_1.WAGTAIL_CONFIG.CSRF_TOKEN}/>
          <button type="submit" className={`sidebar-menu-item__link ${item.classNames}`} onClick={onClick}>
            {item.iconName && (<Icon_1.default name={item.iconName} className="icon--menuitem"/>)}
            <span className="menuitem">
              <span className="menuitem-label">{item.label}</span>
              {!(0, MainMenu_1.isDismissed)(item, state) && (<span className="w-dismissible-badge">
                  <span className="w-sr-only">{(0, gettext_1.gettext)('(New)')}</span>
                </span>)}
            </span>
          </button>
        </form>
      </react_1.default>
    </li>);
};
exports.ActionMenuItem = ActionMenuItem;
class ActionMenuItemDefinition {
    constructor({ name, label, action, attrs, icon_name: iconName = null, classname = undefined, method = 'POST', }) {
        this.name = name;
        this.label = label;
        this.action = action;
        this.attrs = attrs;
        this.iconName = iconName;
        this.classNames = classname;
        this.method = method;
    }
    render({ path, slim, state, dispatch, navigate }) {
        return (<exports.ActionMenuItem key={this.name} item={this} path={path} slim={slim} state={state} dispatch={dispatch} navigate={navigate}/>);
    }
}
exports.ActionMenuItemDefinition = ActionMenuItemDefinition;
