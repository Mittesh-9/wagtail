"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
/**
 * Adds the ability to collectively toggle a set of (non-disabled) checkboxes.
 *
 * @example - Basic usage
 * <div data-controller="w-bulk">
 *   <input type="checkbox" data-action="w-bulk#toggleAll" data-w-bulk-target="all">
 *   <div>
 *     <input type="checkbox" data-action="w-bulk#toggle" data-w-bulk-target="item" disabled>
 *     <input type="checkbox" data-action="w-bulk#toggle" data-w-bulk-target="item">
 *     <input type="checkbox" data-action="w-bulk#toggle" data-w-bulk-target="item">
 *   </div>
 *   <button data-action="w-bulk#toggleAll" data-w-bulk-force-param="false">Clear all</button>
 *   <button data-action="w-bulk#toggleAll" data-w-bulk-force-param="true">Select all</button>
 * </div>
 *
 * @example - Showing and hiding an actions container
 * <div data-controller="w-bulk" data-w-bulk-action-inactive-class="w-invisible">
 *   <div class="w-invisible" data-w-bulk-target="action" id="inner-actions">
 *     <button type="button">Some action</button>
 *   </div>
 *   <input data-action="w-bulk#toggleAll" data-w-bulk-target="all" type="checkbox"/>
 *   <div id="checkboxes">
 *     <input data-action="w-bulk#toggle" data-w-bulk-target="item" disabled="" type="checkbox" />
 *     <input data-action="w-bulk#toggle" data-w-bulk-target="item" type="checkbox"/>
 *     <input data-action="w-bulk#toggle" data-w-bulk-target="item" type="checkbox" />
 *   </div>
 * </div>

 */
class BulkController extends stimulus_1.Controller {
    get activeItems() {
        return this.itemTargets.filter(({ disabled }) => !disabled);
    }
    /**
     * On creation, ensure that the select all checkboxes are in sync.
     */
    connect() {
        this.toggle();
    }
    /**
     * When something is toggled, ensure the select all targets are kept in sync.
     * Update the classes on the action targets to reflect the current state.
     */
    toggle() {
        const activeItems = this.activeItems;
        const totalCheckedItems = activeItems.filter((item) => item.checked).length;
        const isAnyChecked = totalCheckedItems > 0;
        const isAllChecked = totalCheckedItems === activeItems.length;
        this.allTargets.forEach((target) => {
            // eslint-disable-next-line no-param-reassign
            target.checked = isAllChecked;
        });
        const actionInactiveClasses = this.actionInactiveClasses;
        if (!actionInactiveClasses.length)
            return;
        this.actionTargets.forEach((element) => {
            actionInactiveClasses.forEach((actionInactiveClass) => {
                element.classList.toggle(actionInactiveClass, !isAnyChecked);
            });
        });
    }
    /**
     * Toggles all item checkboxes based on select-all checkbox.
     */
    toggleAll(event) {
        var _a;
        const force = (_a = event === null || event === void 0 ? void 0 : event.params) === null || _a === void 0 ? void 0 : _a.force;
        const checkbox = event.target;
        const isChecked = typeof force === 'boolean' ? force : checkbox.checked;
        this.activeItems.forEach((target) => {
            if (target.checked !== isChecked) {
                // eslint-disable-next-line no-param-reassign
                target.checked = isChecked;
                target.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        this.toggle();
    }
}
exports.BulkController = BulkController;
BulkController.classes = ['actionInactive'];
BulkController.targets = ['action', 'all', 'item'];
