"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_TRANSLATIONS_FAILURE = exports.GET_CHILDREN_FAILURE = exports.GET_PAGE_FAILURE = exports.GET_TRANSLATIONS_SUCCESS = exports.GET_TRANSLATIONS_START = exports.GET_CHILDREN_SUCCESS = exports.GET_CHILDREN_START = exports.GET_PAGE_SUCCESS = void 0;
const explorer_1 = require("./explorer");
const defaultPageState = {
    id: 0,
    isFetchingChildren: false,
    isFetchingTranslations: false,
    isError: false,
    children: {
        items: [],
        count: 0,
    },
    meta: {
        status: {
            status: '',
            live: false,
            has_unpublished_changes: true,
        },
        parent: null,
        children: {},
    },
};
exports.GET_PAGE_SUCCESS = 'GET_PAGE_SUCCESS';
exports.GET_CHILDREN_START = 'GET_CHILDREN_START';
exports.GET_CHILDREN_SUCCESS = 'GET_CHILDREN_SUCCESS';
exports.GET_TRANSLATIONS_START = 'GET_TRANSLATIONS_START';
exports.GET_TRANSLATIONS_SUCCESS = 'GET_TRANSLATIONS_SUCCESS';
exports.GET_PAGE_FAILURE = 'GET_PAGE_FAILURE';
exports.GET_CHILDREN_FAILURE = 'GET_CHILDREN_FAILURE';
exports.GET_TRANSLATIONS_FAILURE = 'GET_TRANSLATIONS_FAILURE';
/**
 * A single page node in the explorer.
 */
const node = (state = defaultPageState /* eslint-disable-line default-param-last */, action) => {
    switch (action.type) {
        case exports.GET_PAGE_SUCCESS:
            return Object.assign(Object.assign(Object.assign({}, state), action.payload.data), { isError: false });
        case exports.GET_CHILDREN_START:
            return Object.assign(Object.assign({}, state), { isFetchingChildren: true });
        case exports.GET_TRANSLATIONS_START:
            return Object.assign(Object.assign({}, state), { isFetchingTranslations: true });
        case exports.GET_CHILDREN_SUCCESS:
            return Object.assign(Object.assign({}, state), { isFetchingChildren: false, isError: false, children: {
                    items: state.children.items
                        .slice()
                        .concat(action.payload.items.map((item) => item.id)),
                    count: action.payload.meta.total_count,
                } });
        case exports.GET_TRANSLATIONS_SUCCESS:
            // eslint-disable-next-line no-case-declarations
            const translations = new Map();
            action.payload.items.forEach((item) => {
                translations.set(item.meta.locale, item.id);
            });
            return Object.assign(Object.assign({}, state), { isFetchingTranslations: false, isError: false, translations });
        case exports.GET_PAGE_FAILURE:
        case exports.GET_CHILDREN_FAILURE:
        case exports.GET_TRANSLATIONS_FAILURE:
            return Object.assign(Object.assign({}, state), { isFetchingChildren: false, isFetchingTranslations: true, isError: true });
        default:
            return state;
    }
};
const defaultState = {};
/**
 * Contains all of the page nodes in one object.
 */
function nodes(state = defaultState /* eslint-disable-line default-param-last */, action) {
    switch (action.type) {
        case explorer_1.OPEN_EXPLORER: {
            return Object.assign(Object.assign({}, state), { [action.payload.id]: Object.assign({}, defaultPageState) });
        }
        case exports.GET_PAGE_SUCCESS:
        case exports.GET_CHILDREN_START:
        case exports.GET_TRANSLATIONS_START:
        case exports.GET_PAGE_FAILURE:
        case exports.GET_CHILDREN_FAILURE:
        case exports.GET_TRANSLATIONS_FAILURE:
            return Object.assign(Object.assign({}, state), { [action.payload.id]: node(state[action.payload.id], action) });
        case exports.GET_CHILDREN_SUCCESS:
        case exports.GET_TRANSLATIONS_SUCCESS:
            // eslint-disable-next-line no-case-declarations
            const newState = Object.assign(Object.assign({}, state), { [action.payload.id]: node(state[action.payload.id], action) });
            action.payload.items.forEach((item) => {
                newState[item.id] = Object.assign(Object.assign({}, defaultPageState), item);
            });
            return newState;
        case explorer_1.CLOSE_EXPLORER: {
            return defaultState;
        }
        default:
            return state;
    }
}
exports.default = nodes;
