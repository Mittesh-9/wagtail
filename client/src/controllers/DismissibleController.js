"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DismissibleController = exports.updateDismissibles = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const wagtailConfig_1 = require("../config/wagtailConfig");
/**
 * Updates the server, using a PATCH request when the toggle is clicked on a dismissible
 * element initialised by DismissibleController
 *
 * @param data - The dismissible represented as an object with keys as
 * the id and its new state: whether it is dismissed (boolean)
 *
 * @example
 * const data = { 'dismissible-1': true, 'dismissible-2': false };
 * const wagtailConfig = {}
 *
 * updateDismissibles(data, wagtailConfig);
 */
const updateDismissibles = (data) => {
    var _a;
    return fetch((_a = wagtailConfig_1.WAGTAIL_CONFIG.ADMIN_URLS) === null || _a === void 0 ? void 0 : _a.DISMISSIBLES, {
        method: 'PATCH',
        headers: {
            [wagtailConfig_1.WAGTAIL_CONFIG.CSRF_HEADER_NAME]: wagtailConfig_1.WAGTAIL_CONFIG.CSRF_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'same-origin',
    });
};
exports.updateDismissibles = updateDismissibles;
/**
 * Adds the ability to make an element dismissible so that it updates it's class and makes an async request.
 * Initialise such elements with a default handler that performs the dismissal.
 * This only initialises elements that are rendered by the server (if they have the data attr), so elements
 * that are rendered by the client (e.g. React) needs to be handled separately.
 *
 * @example
 * <section
 *  data-controller="w-dismissible"
 *  data-w-dismissible-dismissed-class="w-dismissible--dismissed"
 *  data-w-dismissible-id-value="Whats new in Wagtail"
 * >
 *  <button type="button" data-action="w-dismiss#dismissible">Close</button>
 * </section>
 */
class DismissibleController extends stimulus_1.Controller {
    /**
     * Upon activating the toggle, send an update to the server and add the
     * appropriate class and data attribute optimistically. Each dismissible
     * defines how it uses (or not) these indicators.
     */
    toggle() {
        if (!this.idValue)
            return;
        this.element.classList.add(this.dismissedClass);
        this.dismissedValue = true;
        (0, exports.updateDismissibles)({ [this.idValue]: true });
    }
}
exports.DismissibleController = DismissibleController;
DismissibleController.classes = ['dismissed'];
DismissibleController.values = {
    dismissed: { default: false, type: Boolean },
    id: { default: '', type: String },
};
