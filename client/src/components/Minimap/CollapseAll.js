"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../utils/gettext");
const Icon_1 = __importDefault(require("../Icon/Icon"));
/**
 * "Collapse all" button UI, without any collapsing logic.
 */
const CollapseAll = ({ expanded, floating, insideMinimap, onClick, }) => (<button type="button" aria-expanded={expanded} onClick={onClick} className={`button button-small button-secondary w-minimap__collapse-all ${floating ? 'w-minimap__collapse-all--floating' : ''} ${insideMinimap ? 'w-minimap__collapse-all--inside' : ''}`}>
    <Icon_1.default name={expanded ? 'collapse-up' : 'collapse-down'}/>
    {expanded ? (0, gettext_1.gettext)('Collapse all') : (0, gettext_1.gettext)('Expand all')}
  </button>);
exports.default = CollapseAll;
