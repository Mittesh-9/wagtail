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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const actions = __importStar(require("./actions"));
const PageExplorerPanel_1 = __importDefault(require("./PageExplorerPanel"));
const PageExplorer = ({ isVisible, depth, currentPageId, nodes, gotoPage, onClose, navigate, }) => isVisible && currentPageId ? (<PageExplorerPanel_1.default depth={depth} page={nodes[currentPageId]} nodes={nodes} gotoPage={gotoPage} onClose={onClose} navigate={navigate}/>) : null;
const mapStateToProps = (state) => ({
    depth: state.explorer.depth,
    currentPageId: state.explorer.currentPageId,
    nodes: state.nodes,
});
const mapDispatchToProps = (dispatch) => ({
    gotoPage: (id, transition) => dispatch(actions.gotoPage(id, transition)),
});
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(PageExplorer);
