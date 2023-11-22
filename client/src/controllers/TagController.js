"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const jquery_1 = __importDefault(require("jquery"));
const stimulus_1 = require("@hotwired/stimulus");
const domReady_1 = require("../utils/domReady");
/**
 * Attach the jQuery tagit UI to the controlled element.
 *
 * See https://github.com/aehlke/tag-it
 *
 * @example
 * <input id="id_tags" type="text" name="tags" data-controller="w-tag" data-w-tag-url-value="/admin/tag-autocomplete/" />
 */
class TagController extends stimulus_1.Controller {
    /**
     * Prepare a global function that preserves the previous approach to
     * registering a tagit field. This will be removed in a future release.
     *
     * @deprecated RemovedInWagtail60
     */
    static afterLoad(identifier, { schema: { controllerAttribute } }) {
        window.initTagField = (id, url, options = {}) => {
            (0, domReady_1.domReady)().then(() => {
                const tagFieldElement = document.getElementById(id);
                if (!tagFieldElement || !url)
                    return;
                Object.entries({ options: JSON.stringify(options), url }).forEach(([name, value]) => {
                    tagFieldElement.setAttribute(`data-${identifier}-${name}-value`, value);
                });
                tagFieldElement.setAttribute(controllerAttribute, identifier);
            });
        };
    }
    connect() {
        const preprocessTag = this.cleanTag.bind(this);
        (0, jquery_1.default)(this.element).tagit(Object.assign({ autocomplete: { source: this.urlValue }, preprocessTag }, this.optionsValue));
    }
    /**
     * Double quote a tag if it contains a space
     * and if it isn't already quoted.
     */
    cleanTag(val) {
        return val && val[0] !== '"' && val.indexOf(' ') > -1 ? `"${val}"` : val;
    }
    /**
     * Method to clear all the tags that are set.
     */
    clear() {
        (0, jquery_1.default)(this.element).tagit('removeAll');
    }
}
exports.TagController = TagController;
TagController.values = {
    options: { default: {}, type: Object },
    url: String,
};
