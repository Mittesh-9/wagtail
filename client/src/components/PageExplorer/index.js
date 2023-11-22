"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPageExplorerStore = void 0;
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
// import { perfMiddleware } from '../../utils/performance';
const PageExplorer_1 = __importDefault(require("./PageExplorer"));
const explorer_1 = __importDefault(require("./reducers/explorer"));
const nodes_1 = __importDefault(require("./reducers/nodes"));
const initPageExplorerStore = () => {
    const rootReducer = (0, redux_1.combineReducers)({
        explorer: explorer_1.default,
        nodes: nodes_1.default,
    });
    const middleware = [redux_thunk_1.default];
    // Uncomment this to use performance measurements.
    // if (process.env.NODE_ENV !== 'production') {
    //   middleware.push(perfMiddleware);
    // }
    return (0, redux_1.createStore)(rootReducer, {}, (0, redux_1.compose)((0, redux_1.applyMiddleware)(...middleware), 
    // Expose store to Redux DevTools extension.
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (func) => func));
};
exports.initPageExplorerStore = initPageExplorerStore;
exports.default = PageExplorer_1.default;
