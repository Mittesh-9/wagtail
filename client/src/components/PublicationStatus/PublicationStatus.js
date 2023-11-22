"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
/**
 * Displays the publication status of a page in a pill.
 */
const PublicationStatus = ({ status }) => (<span className={`o-pill c-status${status.live ? ' c-status--live' : ''}`}>
    {status.status}
  </span>);
PublicationStatus.propTypes = {
    status: prop_types_1.default.shape({
        live: prop_types_1.default.bool.isRequired,
        status: prop_types_1.default.string.isRequired,
    }).isRequired,
};
exports.default = PublicationStatus;
