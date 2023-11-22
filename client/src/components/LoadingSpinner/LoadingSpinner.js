"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../utils/gettext");
const Icon_1 = __importDefault(require("../Icon/Icon"));
/**
 * A loading indicator with a text label next to it.
 */
const LoadingSpinner = () => (<span>
    <Icon_1.default name="spinner" className="c-spinner"/>
    {` ${(0, gettext_1.gettext)('Loading…')}`}
  </span>);
exports.default = LoadingSpinner;
