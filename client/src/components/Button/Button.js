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
const React = __importStar(require("react"));
const handleClick = (href, onClick, preventDefault, navigate, e) => {
    if (preventDefault && href === '#') {
        e.preventDefault();
        e.stopPropagation();
    }
    if (onClick) {
        onClick(e);
    }
    // Do not capture click events with modifier keys or non-main buttons.
    if (e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button !== 0)) {
        return;
    }
    // If a navigate handler has been specified, replace the default behaviour
    if (navigate && !e.defaultPrevented) {
        e.preventDefault();
        navigate(href);
    }
};
/**
 * A reusable button. Uses a <a> tag underneath.
 */
const Button = ({ className = '', children, accessibleLabel, href = '#', target, preventDefault = true, onClick, dialogTrigger, navigate, }) => {
    const hasText = React.Children.count(children) > 0;
    const accessibleElt = accessibleLabel ? (<span className="visuallyhidden">{accessibleLabel}</span>) : null;
    return (<a className={className} onClick={handleClick.bind(null, href, onClick, preventDefault, navigate)} rel={target === '_blank' ? 'noreferrer' : undefined} href={href} target={target} aria-haspopup={dialogTrigger ? 'dialog' : undefined}>
      {hasText ? children : accessibleElt}
    </a>);
};
exports.default = Button;
