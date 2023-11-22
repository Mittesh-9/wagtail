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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarPanel = void 0;
const React = __importStar(require("react"));
const SidebarPanel = ({ isVisible, isOpen, depth, widthPx, children, }) => {
    const className = 'sidebar-panel' +
        (isVisible ? ' sidebar-panel--visible' : '') +
        (isOpen ? ' sidebar-panel--open' : '');
    let zIndex = -depth * 2;
    const isClosing = isVisible && !isOpen;
    if (isClosing) {
        // When closing, make sure this panel displays behind any new panel that is opening
        zIndex -= 1;
    }
    const style = {
        // See https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors.
        ['--z-index']: zIndex,
    };
    if (widthPx) {
        style['--width'] = widthPx + 'px';
    }
    return (<div className={className} style={style}>
      {children}
    </div>);
};
exports.SidebarPanel = SidebarPanel;
