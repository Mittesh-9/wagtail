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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoPage = exports.openPageExplorer = exports.closePageExplorer = void 0;
const admin = __importStar(require("../../api/admin"));
const actions_1 = require("../../utils/actions");
const wagtailConfig_1 = require("../../config/wagtailConfig");
const getPageSuccess = (0, actions_1.createAction)('GET_PAGE_SUCCESS', (id, data) => ({ id, data }));
const getPageFailure = (0, actions_1.createAction)('GET_PAGE_FAILURE', (id, error) => ({ id, error }));
/**
 * Gets a page from the API.
 */
function getPage(id) {
    return (dispatch) => admin.getPage(id).then((data) => {
        dispatch(getPageSuccess(id, data));
    }, (error) => {
        dispatch(getPageFailure(id, error));
    });
}
const getChildrenStart = (0, actions_1.createAction)('GET_CHILDREN_START', (id) => ({
    id,
}));
const getChildrenSuccess = (0, actions_1.createAction)('GET_CHILDREN_SUCCESS', (id, items, meta) => ({ id, items, meta }));
const getChildrenFailure = (0, actions_1.createAction)('GET_CHILDREN_FAILURE', (id, error) => ({ id, error }));
/**
 * Gets the children of a node from the API.
 */
function getChildren(id, offset = 0) {
    return (dispatch) => {
        dispatch(getChildrenStart(id));
        return admin
            .getPageChildren(id, {
            offset: offset,
        })
            .then(({ items, meta }) => {
            const nbPages = offset + items.length;
            dispatch(getChildrenSuccess(id, items, meta));
            // Load more pages if necessary. Only one request is created even though
            // more might be needed, thus naturally throttling the loading.
            if (nbPages < meta.total_count && nbPages < wagtailConfig_1.MAX_EXPLORER_PAGES) {
                dispatch(getChildren(id, nbPages));
            }
        }, (error) => {
            dispatch(getChildrenFailure(id, error));
        });
    };
}
const getTranslationsStart = (0, actions_1.createAction)('GET_TRANSLATIONS_START', (id) => ({
    id,
}));
const getTranslationsSuccess = (0, actions_1.createAction)('GET_TRANSLATIONS_SUCCESS', (id, items) => ({ id, items }));
const getTranslationsFailure = (0, actions_1.createAction)('GET_TRANSLATIONS_FAILURE', (id, error) => ({ id, error }));
/**
 * Gets the translations of a node from the API.
 */
function getTranslations(id) {
    return (dispatch) => {
        dispatch(getTranslationsStart(id));
        return admin.getAllPageTranslations(id, { onlyWithChildren: true }).then((items) => {
            dispatch(getTranslationsSuccess(id, items));
        }, (error) => {
            dispatch(getTranslationsFailure(id, error));
        });
    };
}
const openPageExplorerPrivate = (0, actions_1.createAction)('OPEN_EXPLORER', (id) => ({ id }));
exports.closePageExplorer = (0, actions_1.createAction)('CLOSE_EXPLORER');
function openPageExplorer(id) {
    return (dispatch, getState) => {
        const { nodes } = getState();
        const page = nodes[id];
        dispatch(openPageExplorerPrivate(id));
        if (!page) {
            dispatch(getChildren(id));
            if (id !== 1) {
                dispatch(getTranslations(id));
            }
        }
        // We need to get the title of the starting page, only if it is not the site's root.
        const isNotRoot = id !== 1;
        if (isNotRoot) {
            dispatch(getPage(id));
        }
    };
}
exports.openPageExplorer = openPageExplorer;
const gotoPagePrivate = (0, actions_1.createAction)('GOTO_PAGE', (id, transition) => ({ id, transition }));
function gotoPage(id, transition) {
    return (dispatch, getState) => {
        const { nodes } = getState();
        const page = nodes[id];
        dispatch(gotoPagePrivate(id, transition));
        if (page && !page.isFetchingChildren && !(page.children.count > 0)) {
            dispatch(getChildren(id));
        }
        if (page && !page.isFetchingTranslations && page.translations == null) {
            dispatch(getTranslations(id));
        }
    };
}
exports.gotoPage = gotoPage;
