"use strict";
/**
 * Utils related to text/strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = exports.cleanForSlug = void 0;
/**
 * Returns the supplied string as a slug optionally using the vendor URLify util.
 * If not using URLify it will read the global unicodeSlugsEnabled and return a slugified string.
 *
 * @param {string} val - value to be parsed into a slug
 * @param {boolean} useURLify - if true, the vendor URLify will be used
 * @returns {string}
 */
function cleanForSlug(val, useURLify, { unicodeSlugsEnabled = window.unicodeSlugsEnabled, } = {}) {
    if (useURLify) {
        // URLify performs extra processing on the string (e.g. removing stopwords) and is more suitable
        // for creating a slug from the title, rather than sanitising a slug entered manually
        const cleaned = window.URLify(val, 255);
        // if the result is blank (e.g. because the title consisted entirely of stopwords),
        // fall through to the non-URLify method
        if (cleaned) {
            return cleaned;
        }
    }
    // just do the "replace"
    if (unicodeSlugsEnabled) {
        return val
            .replace(/\s+/g, '-')
            .replace(/[&/\\#,+()$~%.'":`@^!*?<>{}]/g, '')
            .toLowerCase();
    }
    return val
        .replace(/\s+/g, '-')
        .replace(/[^A-Za-z0-9\-_]/g, '')
        .toLowerCase();
}
exports.cleanForSlug = cleanForSlug;
/**
 * Escapes provided HTML.
 *
 * https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
 *
 * @param {string} unsafe - raw HTML to be made safe
 * @returns {string}
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
exports.escapeHtml = escapeHtml;
