"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/static-property-placement */
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
/**
 * A Portal component which automatically closes itself
 * when certain events happen outside.
 * See https://reactjs.org/docs/portals.html.
 */
class Portal extends react_1.Component {
    constructor(props) {
        super(props);
        this.portal = document.createElement('div');
        this.onCloseEvent = this.onCloseEvent.bind(this);
    }
    onCloseEvent(event) {
        const { onClose } = this.props;
        const target = event.target;
        if (!this.portal.contains(target)) {
            onClose();
        }
    }
    componentDidMount() {
        const { node, onClose, closeOnClick, closeOnType, closeOnResize } = this.props;
        node.appendChild(this.portal);
        if (closeOnClick) {
            document.addEventListener('mouseup', this.onCloseEvent);
        }
        if (closeOnType) {
            document.addEventListener('keyup', this.onCloseEvent);
        }
        if (closeOnResize) {
            window.addEventListener('resize', onClose);
        }
    }
    componentWillUnmount() {
        const { node, onClose } = this.props;
        node.removeChild(this.portal);
        document.removeEventListener('mouseup', this.onCloseEvent);
        document.removeEventListener('keyup', this.onCloseEvent);
        window.removeEventListener('resize', onClose);
    }
    render() {
        const { children } = this.props;
        return (0, react_dom_1.createPortal)(children, this.portal);
    }
}
Portal.propTypes = {
    onClose: prop_types_1.default.func.isRequired,
    node: prop_types_1.default.instanceOf(Element),
    children: prop_types_1.default.node,
    closeOnClick: prop_types_1.default.bool,
    closeOnType: prop_types_1.default.bool,
    closeOnResize: prop_types_1.default.bool,
};
Portal.defaultProps = {
    node: document.body,
    children: null,
    closeOnClick: false,
    closeOnType: false,
    closeOnResize: false,
};
exports.default = Portal;
