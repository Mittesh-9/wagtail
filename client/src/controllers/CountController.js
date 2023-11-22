"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const gettext_1 = require("../utils/gettext");
const DEFAULT_ERROR_SELECTOR = '.error-message,.help-critical';
/**
 * Adds the ability for a controlled element to update the total count
 * of selected elements within the provided container selector, defaults
 * do `body.`
 *
 * @example
 * <div data-controller="w-count">
 *  <span data-w-count-target="label"></span>
 *  <span class="error-message">An error</span>
 * </div>
 */
class CountController extends stimulus_1.Controller {
    connect() {
        this.count();
    }
    count() {
        this.totalValue = [
            ...document.querySelectorAll(this.containerValue || 'body'),
        ]
            .map((element) => element.querySelectorAll(this.findValue).length)
            .reduce((total, subTotal) => total + subTotal, 0);
        return this.totalValue;
    }
    getLabel(total) {
        const defaultText = (0, gettext_1.ngettext)('%(num)s error', '%(num)s errors', total);
        if (this.labelsValue.length > 1) {
            const [single, plural = this.labelsValue[1], key = '__total__'] = this.labelsValue;
            return (0, gettext_1.ngettext)(single, plural, total).replace(key, `${total}`);
        }
        return defaultText.replace('%(num)s', `${total}`);
    }
    minValueChanged() {
        this.totalValueChanged(this.count());
    }
    totalValueChanged(total) {
        const min = this.minValue;
        if (this.hasActiveClass) {
            this.element.classList.toggle(this.activeClass, total > min);
        }
        if (this.hasLabelTarget) {
            this.labelTarget.textContent = total > min ? this.getLabel(total) : '';
        }
        if (this.hasTotalTarget) {
            this.totalTarget.textContent = total > min ? `${total}` : '';
        }
    }
}
exports.CountController = CountController;
CountController.classes = ['active'];
CountController.targets = ['label', 'total'];
CountController.values = {
    container: { default: 'body', type: String },
    find: { default: DEFAULT_ERROR_SELECTOR, type: String },
    labels: { default: [], type: Array },
    min: { default: 0, type: Number },
    total: { default: 0, type: Number },
};
