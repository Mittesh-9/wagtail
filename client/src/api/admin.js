"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPageTranslations = exports.getPageTranslations = exports.getPageChildren = exports.getPage = void 0;
const client_1 = __importDefault(require("./client"));
const wagtailConfig_1 = require("../config/wagtailConfig");
const getPage = (id) => {
    const url = `${wagtailConfig_1.ADMIN_API.PAGES}${id}/`;
    return client_1.default.get(url);
};
exports.getPage = getPage;
const getPageChildren = (id, options = {}) => {
    let url = `${wagtailConfig_1.ADMIN_API.PAGES}?child_of=${id}&for_explorer=1`;
    if (options.fields) {
        url += `&fields=parent,${window.encodeURIComponent(options.fields.join(','))}`;
    }
    else {
        url += '&fields=parent';
    }
    if (options.onlyWithChildren) {
        url += '&has_children=1';
    }
    if (options.offset) {
        url += `&offset=${options.offset}`;
    }
    url += wagtailConfig_1.ADMIN_API.EXTRA_CHILDREN_PARAMETERS;
    return client_1.default.get(url);
};
exports.getPageChildren = getPageChildren;
const getPageTranslations = (id, options = {}) => {
    let url = `${wagtailConfig_1.ADMIN_API.PAGES}?translation_of=${id}&limit=20`;
    if (options.fields) {
        url += `&fields=parent,${global.encodeURIComponent(options.fields.join(','))}`;
    }
    else {
        url += '&fields=parent';
    }
    if (options.onlyWithChildren) {
        url += '&has_children=1';
    }
    if (options.offset) {
        url += `&offset=${options.offset}`;
    }
    return client_1.default.get(url);
};
exports.getPageTranslations = getPageTranslations;
const getAllPageTranslations = (id, options) => __awaiter(void 0, void 0, void 0, function* () {
    const items = [];
    let iterLimit = 100;
    for (;;) {
        // eslint-disable-next-line no-await-in-loop
        const page = yield (0, exports.getPageTranslations)(id, Object.assign({ offset: items.length }, options));
        page.items.forEach((item) => items.push(item));
        // eslint-disable-next-line no-plusplus
        if (items.length >= page.meta.total_count || iterLimit-- <= 0) {
            return items;
        }
    }
});
exports.getAllPageTranslations = getAllPageTranslations;
