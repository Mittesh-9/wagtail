"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const debounce_1 = require("../utils/debounce");
const noop_1 = require("../utils/noop");
/**
 * Adds the ability for a controlled element to pick an element from a template
 * and then clone that element, adding it to the container.
 * Additionally, it will allow for clearing all previously added elements.
 *
 * @example - Using with the w-messages identifier
 * <div
 *   data-controller="w-messages"
 *   data-action="w-messages:add@document->w-messages#add"
 *   data-w-messages-added-class="new"
 *   data-w-messages-show-class="appear"
 * >
 *   <ul data-w-messages-target="container"></ul>
 *   <template data-w-messages-target="template">
 *     <li data-message-status="error-or-success"><span></span></li>
 *  </template>
 * </div>
 */
class CloneController extends stimulus_1.Controller {
    /**
     * Adds a new element to the container based on the type argument provided in the event
     * or action params objects. Optionally clearing the container first with support for
     * added custom text inside the added element.
     */
    add(event) {
        const { clear = false, text = '', type = null, } = Object.assign(Object.assign({}, event === null || event === void 0 ? void 0 : event.detail), event === null || event === void 0 ? void 0 : event.params);
        this.element.classList.add(...this.addedClasses);
        if (clear)
            this.clear();
        const content = this.getTemplateContent(type);
        if (!content)
            return;
        const textElement = content.lastElementChild;
        if (textElement instanceof HTMLElement && text) {
            textElement.textContent = text;
        }
        this.containerTarget.appendChild(content);
        (0, debounce_1.debounce)(() => {
            this.element.classList.remove(...this.hideClasses);
            this.element.classList.add(...this.showClasses);
            this.dispatch('added');
        }, this.showDelayValue || null /* run immediately if zero */)();
    }
    /**
     * If called with an event (or any truthy argument) reset the classes for show/hide
     * so the this method can be used intentionally via actions allowing clearing after
     * animations have run.
     */
    clear(event) {
        this.isClearing = false;
        if (!event) {
            this.containerTarget.innerHTML = '';
            return;
        }
        const clearDelayValue = this.clearDelayValue || null;
        const element = this.element;
        this.isClearing = true;
        element.classList.remove(...this.addedClasses);
        element.classList.remove(...this.showClasses);
        element.classList.add(...this.hideClasses);
        (0, debounce_1.debounce)(noop_1.noop, clearDelayValue)().then(() => {
            if (!(this === null || this === void 0 ? void 0 : this.isClearing))
                return;
            this.containerTarget.innerHTML = '';
            this.dispatch('cleared');
            this.isClearing = false;
        });
    }
    /**
     * If no type provided, return the first template target, otherwise try to find
     * a matching target, finally fall back on the first template target if nothing
     * is found.
     */
    getTemplateContent(type) {
        var _a;
        const template = (type &&
            this.templateTargets.find(({ dataset }) => dataset.type === type)) ||
            this.templateTarget;
        const content = (_a = template.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        return content instanceof HTMLElement ? content : null;
    }
}
exports.CloneController = CloneController;
CloneController.classes = ['added', 'hide', 'show'];
CloneController.targets = ['container', 'template'];
CloneController.values = {
    clearDelay: { default: 0, type: Number },
    showDelay: { default: 0, type: Number },
};
