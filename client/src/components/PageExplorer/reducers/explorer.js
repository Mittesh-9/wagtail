"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOTO_PAGE = exports.CLOSE_EXPLORER = exports.OPEN_EXPLORER = void 0;
const defaultState = {
    depth: 0,
    currentPageId: null,
};
exports.OPEN_EXPLORER = 'OPEN_EXPLORER';
exports.CLOSE_EXPLORER = 'CLOSE_EXPLORER';
exports.GOTO_PAGE = 'GOTO_PAGE';
/**
 * Oversees the state of the explorer. Defines:
 * - Where in the page tree the explorer is at.
 * - Whether the explorer is open or not.
 */
function explorer(prevState = defaultState /* eslint-disable-line default-param-last */, action) {
    switch (action.type) {
        case exports.OPEN_EXPLORER:
            // Provide a starting page when opening the explorer.
            return {
                depth: 0,
                currentPageId: action.payload.id,
            };
        case exports.CLOSE_EXPLORER:
            return defaultState;
        case exports.GOTO_PAGE:
            return {
                depth: prevState.depth + action.payload.transition,
                currentPageId: action.payload.id,
            };
        default:
            return prevState;
    }
}
exports.default = explorer;
