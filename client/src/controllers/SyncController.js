"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const debounce_1 = require("../utils/debounce");
/**
 * Adds ability to sync the value or interactions with one input with one
 * or more targeted other inputs.
 *
 * @example
 * <section>
 *   <input type="text" name="title" id="title" />
 *   <input
 *     type="date"
 *     id="event-date"
 *     name="event-date"
 *     value="2025-07-22"
 *     data-controller="w-sync"
 *     data-action="change->w-sync#apply cut->w-sync#clear focus->w-sync#check"
 *     data-w-sync-target-value="#title"
 *   />
 * </section>
 */
class SyncController extends stimulus_1.Controller {
    /**
     * Dispatches an event to all target elements so that they can be notified
     * that a sync has started, allowing them to disable the sync by preventing
     * default.
     */
    connect() {
        this.processTargetElements('start', true);
        this.apply = (0, debounce_1.debounce)(this.apply.bind(this), this.debounceValue);
    }
    /**
     * Allows for targeted elements to determine, via preventing the default event,
     * whether this sync controller should be disabled.
     */
    check() {
        this.processTargetElements('check', true);
    }
    /**
     * Applies a value from the controlled element to the targeted
     * elements. Calls to this method are debounced based on the
     * controller's `debounceValue`.
     *
     * Applying of the value to the targets can be done with a delay,
     * based on the controller's `delayValue`.
     */
    apply(event) {
        var _a;
        const valueToApply = ((_a = event === null || event === void 0 ? void 0 : event.params) === null || _a === void 0 ? void 0 : _a.apply) || this.element.value;
        const applyValue = (target) => {
            /* use setter to correctly update value in non-inputs (e.g. select) */ // eslint-disable-next-line no-param-reassign
            target.value = valueToApply;
            if (this.quietValue)
                return;
            this.dispatch('change', {
                cancelable: false,
                prefix: '',
                target,
            });
        };
        this.processTargetElements('apply').forEach((target) => {
            if (this.delayValue) {
                setTimeout(() => {
                    applyValue(target);
                }, this.delayValue);
            }
            else {
                applyValue(target);
            }
        });
    }
    /**
     * Clears the value of the targeted elements.
     */
    clear() {
        this.processTargetElements('clear').forEach((target) => {
            setTimeout(() => {
                target.setAttribute('value', '');
                if (this.quietValue)
                    return;
                this.dispatch('change', {
                    cancelable: false,
                    prefix: '',
                    target: target,
                });
            }, this.delayValue);
        });
    }
    /**
     * Simple method to dispatch a ping event to the targeted elements.
     */
    ping() {
        this.processTargetElements('ping', false, { bubbles: true });
    }
    /**
     * Returns the non-default prevented elements that are targets of this sync
     * controller. Additionally allows this processing to enable or disable
     * this controller instance's sync behaviour.
     */
    processTargetElements(eventName, resetDisabledValue = false, options = {}) {
        if (!resetDisabledValue && this.disabledValue) {
            return [];
        }
        const targetElements = [
            ...document.querySelectorAll(this.targetValue),
        ];
        const elements = targetElements.filter((target) => {
            const event = this.dispatch(eventName, Object.assign(Object.assign({ bubbles: false, cancelable: true }, options), { detail: { element: this.element, value: this.element.value }, target: target }));
            return !event.defaultPrevented;
        });
        if (resetDisabledValue) {
            this.disabledValue = targetElements.length > elements.length;
        }
        return elements;
    }
}
exports.SyncController = SyncController;
SyncController.values = {
    debounce: { default: 100, type: Number },
    delay: { default: 0, type: Number },
    disabled: { default: false, type: Boolean },
    quiet: { default: false, type: Boolean },
    target: String,
};
