"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../utils/gettext");
const Icon_1 = __importDefault(require("../Icon/Icon"));
const requiredMark = <span className="w-required-mark">*</span>;
/**
 * A single menu item inside the minimap, linking to a section of the page.
 */
const MinimapItem = ({ item, intersects, expanded, onClick, }) => {
    const { href, label, icon, required, errorCount, level } = item;
    const hasError = errorCount > 0;
    const errorsLabel = (0, gettext_1.ngettext)('%(num)s error', '%(num)s errors', errorCount).replace('%(num)s', `${errorCount}`);
    const text = label.length > 22 ? `${label.substring(0, 22)}…` : label;
    return (<a href={href} className={`w-minimap-item w-minimap-item--${level} ${intersects ? 'w-minimap-item--active' : ''} ${hasError ? 'w-minimap-item--error' : ''}`} onClick={onClick.bind(null, item)} aria-current={intersects} 
    // Prevent interacting with the links when they are only partially shown.
    tabIndex={expanded ? undefined : -1} 
    // Use the toggle button as description when collapsed.
    aria-describedby={expanded ? undefined : 'w-minimap-toggle'}>
      {hasError ? (<div className="w-minimap-item__errors" aria-label={errorsLabel}>
          {errorCount}
        </div>) : null}
      <Icon_1.default name="minus" className="w-minimap-item__placeholder"/>
      {level !== 'h1' && level !== 'h2' ? (<Icon_1.default name={icon} className="w-minimap-item__icon"/>) : null}
      <span className="w-minimap-item__label">
        <span className="w-minimap-item__text">{text}</span>
        {required ? requiredMark : null}
      </span>
    </a>);
};
exports.default = MinimapItem;
