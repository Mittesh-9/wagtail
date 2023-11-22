"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POP = exports.PUSH = void 0;
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const CSSTransitionGroup_1 = __importDefault(require("react-transition-group/CSSTransitionGroup"));
const TRANSITION_DURATION = 210;
// The available transitions. Must match the class names in CSS.
exports.PUSH = 'push';
exports.POP = 'pop';
/**
 * Wrapper around react-transition-group with default values.
 */
const Transition = ({ name, component, className, duration, children }) => (<CSSTransitionGroup_1.default component={component} transitionEnterTimeout={duration} transitionLeaveTimeout={duration} transitionName={`c-transition-${name}`} className={className}>
    {children}
  </CSSTransitionGroup_1.default>);
Transition.propTypes = {
    name: prop_types_1.default.oneOf([exports.PUSH, exports.POP]).isRequired,
    component: prop_types_1.default.string,
    className: prop_types_1.default.string,
    duration: prop_types_1.default.number,
    children: prop_types_1.default.node,
};
Transition.defaultProps = {
    component: 'div',
    children: null,
    className: null,
    duration: TRANSITION_DURATION,
};
exports.default = Transition;
