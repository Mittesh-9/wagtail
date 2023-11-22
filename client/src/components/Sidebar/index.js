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
exports.initSidebar = exports.SIDEBAR_COLLAPSED_COOKIE_NAME = void 0;
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const js_cookie_1 = __importDefault(require("js-cookie"));
const Sidebar_1 = require("./Sidebar");
const noop_1 = require("../../utils/noop");
exports.SIDEBAR_COLLAPSED_COOKIE_NAME = 'wagtail_sidebar_collapsed';
function initSidebar() {
    const cookieOptions = { sameSite: 'lax' };
    const element = document.getElementById('wagtail-sidebar');
    const rawProps = document.getElementById('wagtail-sidebar-props');
    const navigate = (url) => {
        window.location.href = url;
        // Return a promise that never resolves.
        // This promise is used to indicate to any open submenus that the next page has loaded and it should close.
        // As all navigation from the menu at the moment takes the user to another page, we don't need to close the menus.
        // We will need to update this if we later add the ability to render views on the client side.
        return new Promise(noop_1.noop);
    };
    if (element && (rawProps === null || rawProps === void 0 ? void 0 : rawProps.textContent)) {
        const props = window.telepath.unpack(JSON.parse(rawProps.textContent));
        const collapsedCookie = js_cookie_1.default.get(exports.SIDEBAR_COLLAPSED_COOKIE_NAME);
        // Cast to boolean
        const collapsed = !(collapsedCookie === undefined || collapsedCookie === '0');
        const onExpandCollapse = (_collapsed) => {
            if (_collapsed) {
                document.body.classList.add('sidebar-collapsed');
                js_cookie_1.default.set(exports.SIDEBAR_COLLAPSED_COOKIE_NAME, 1, cookieOptions);
            }
            else {
                document.body.classList.remove('sidebar-collapsed');
                js_cookie_1.default.set(exports.SIDEBAR_COLLAPSED_COOKIE_NAME, 0, cookieOptions);
            }
        };
        react_dom_1.default.render(<Sidebar_1.Sidebar modules={props.modules} collapsedOnLoad={collapsed} currentPath={window.location.pathname} navigate={navigate} onExpandCollapse={onExpandCollapse}/>, element, () => {
            var _a;
            document.body.classList.add('ready');
            (_a = document
                .querySelector('[data-wagtail-sidebar]')) === null || _a === void 0 ? void 0 : _a.classList.remove('sidebar-loading');
        });
    }
}
exports.initSidebar = initSidebar;
