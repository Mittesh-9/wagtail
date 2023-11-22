"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const text_1 = require("../utils/text");
/**
 * Adds ability to slugify the value of an input element.
 *
 * @example
 * <input type="text" name="slug" data-controller="w-slug" data-action="blur->w-slug#slugify" />
 */
class SlugController extends stimulus_1.Controller {
    /**
     * Allow for a comparison value to be provided so that a dispatched event can be
     * prevented. This provides a way for other events to interact with this controller
     * to block further updates if a value is not in sync.
     * By default it will compare to the slugify method, this can be overridden by providing
     * either a Stimulus param value on the element or the event's detail.
     */
    compare(event) {
        var _a, _b, _c;
        // do not attempt to compare if the current field is empty
        if (!this.element.value) {
            return true;
        }
        const compareAs = ((_a = event.detail) === null || _a === void 0 ? void 0 : _a.compareAs) || ((_b = event.params) === null || _b === void 0 ? void 0 : _b.compareAs) || 'slugify';
        const compareValue = this[compareAs]({ detail: { value: ((_c = event.detail) === null || _c === void 0 ? void 0 : _c.value) || '' } }, true);
        const currentValue = this.element.value;
        const valuesAreSame = compareValue.trim() === currentValue.trim();
        if (!valuesAreSame) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
        }
        return valuesAreSame;
    }
    /**
     * Basic slugify of a string, updates the controlled element's value
     * or can be used to simply return the transformed value.
     * If a custom event with detail.value is provided, that value will be used
     * instead of the field's value.
     */
    slugify(event, ignoreUpdate = false) {
        const unicodeSlugsEnabled = this.allowUnicodeValue;
        const { value = this.element.value } = (event === null || event === void 0 ? void 0 : event.detail) || {};
        const newValue = (0, text_1.cleanForSlug)(value.trim(), false, { unicodeSlugsEnabled });
        if (!ignoreUpdate) {
            this.element.value = newValue;
        }
        return newValue;
    }
    /**
     * Advanced slugify of a string, updates the controlled element's value
     * or can be used to simply return the transformed value.
     * If a custom event with detail.value is provided, that value will be used
     * instead of the field's value.
     */
    urlify(event, ignoreUpdate = false) {
        const unicodeSlugsEnabled = this.allowUnicodeValue;
        const { value = this.element.value } = (event === null || event === void 0 ? void 0 : event.detail) || {};
        const newValue = (0, text_1.cleanForSlug)(value.trim(), true, { unicodeSlugsEnabled });
        if (!ignoreUpdate) {
            this.element.value = newValue;
        }
        return newValue;
    }
}
exports.SlugController = SlugController;
SlugController.values = {
    allowUnicode: { default: false, type: Boolean },
};
