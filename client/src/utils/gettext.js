"use strict";
/**
 * Translation / Internationalisation utilities based on Django's `JavaScriptCatalogView`
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#module-django.views.i18n
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluralIdx = exports.gettextNoop = exports.getFormat = exports.ngettext = exports.gettext = void 0;
/**
 * The gettext function behaves similarly to the standard gettext interface within Django.
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#gettext
 *
 * @param {string} text
 * @returns {string}
 */
function gettext(text) {
    var _a;
    const djangoGettext = (_a = window.django) === null || _a === void 0 ? void 0 : _a.gettext;
    if (djangoGettext) {
        return djangoGettext(text);
    }
    return text;
}
exports.gettext = gettext;
/**
 * The ngettext function provides an interface to pluralize words and phrases.
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#ngettext
 *
 * @param {string} singular
 * @param {string} plural
 * @param {number} count
 * @returns {string}
 *
 * @example
 * const ngettext('one bird', 'two or more in the hand', 2);
 * // 'two or more in the hand'
 *
 */
function ngettext(singular, plural, count) {
    var _a;
    const djangoNgettext = (_a = window.django) === null || _a === void 0 ? void 0 : _a.ngettext;
    if (djangoNgettext) {
        return djangoNgettext(singular, plural, count);
    }
    return count === 1 ? singular : plural;
}
exports.ngettext = ngettext;
/**
 * The getFormat function has access to the configured i18n formatting settings and
 * can retrieve the format string for a given setting name.
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#get-format
 *
 * @param {FormatType} formatType
 * @returns {str}
 *
 * @example
 * get_format('DATE_FORMAT');
 * // 'N j, Y'
 *
 */
function getFormat(formatType) {
    var _a;
    const djangoGetFormat = (_a = window.django) === null || _a === void 0 ? void 0 : _a.get_format;
    if (djangoGetFormat) {
        return djangoGetFormat(formatType);
    }
    return '';
}
exports.getFormat = getFormat;
/**
 * Marks strings for translation but doesn’t translate them now.
 * This can be used to store strings in global variables that should stay in the base
 * language (because they might be used externally) and will be translated later.
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#gettext_noop
 *
 * @param {string} text
 * @returns {string}
 */
function gettextNoop(text) {
    var _a;
    const djangoGettextNoop = (_a = window.django) === null || _a === void 0 ? void 0 : _a.gettext_noop;
    if (djangoGettextNoop) {
        return djangoGettextNoop(text);
    }
    return text;
}
exports.gettextNoop = gettextNoop;
/**
 * The pluralIdx function works in a similar way to the pluralize template filter,
 * determining if a given count should use a plural form of a word or not.
 *
 * https://docs.djangoproject.com/en/stable/topics/i18n/translation/#pluralidx
 *
 * @param {number} count
 * @returns {boolean}
 *
 * @example
 * pluralIdx(0);
 * // true
 * pluralIdx(1);
 * // false
 * pluralIdx(2);
 * // true
 *
 */
function pluralIdx(count) {
    var _a;
    const djangoPluralIdx = (_a = window.django) === null || _a === void 0 ? void 0 : _a.pluralidx;
    if (djangoPluralIdx) {
        return djangoPluralIdx(count);
    }
    return false;
}
exports.pluralIdx = pluralIdx;
