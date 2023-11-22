"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTooltips = exports.rotateToggleIcon = exports.hideTooltipOnBreadcrumbExpandAndCollapse = exports.hideTooltipOnClickInside = exports.hideTooltipOnEsc = void 0;
const tippy_js_1 = __importDefault(require("tippy.js"));
/**
 * Hides tooltip when escape key is pressed
 */
exports.hideTooltipOnEsc = {
    name: 'hideOnEsc',
    defaultValue: true,
    fn({ hide }) {
        function onKeyDown(event) {
            if (event.key === 'Escape') {
                hide();
            }
        }
        return {
            onShow() {
                document.addEventListener('keydown', onKeyDown);
            },
            onHide() {
                document.removeEventListener('keydown', onKeyDown);
            },
        };
    },
};
/**
 * Hides tooltip when clicking inside.
 */
exports.hideTooltipOnClickInside = {
    name: 'hideTooltipOnClickInside',
    defaultValue: true,
    fn(instance) {
        const onClick = () => instance.hide();
        return {
            onShow() {
                instance.popper.addEventListener('click', onClick);
            },
            onHide() {
                instance.popper.removeEventListener('click', onClick);
            },
        };
    },
};
/**
 * Prevents the tooltip from staying open when the breadcrumbs expand and push the toggle button in the layout
 */
exports.hideTooltipOnBreadcrumbExpandAndCollapse = {
    name: 'hideTooltipOnBreadcrumbAndCollapse',
    fn({ hide }) {
        function onBreadcrumbExpandAndCollapse() {
            hide();
        }
        return {
            onShow() {
                document.addEventListener('w-breadcrumbs:opened', onBreadcrumbExpandAndCollapse);
                document.addEventListener('w-breadcrumbs:closed', onBreadcrumbExpandAndCollapse);
            },
            onHide() {
                document.removeEventListener('w-breadcrumbs:closed', onBreadcrumbExpandAndCollapse);
                document.removeEventListener('w-breadcrumbs:opened', onBreadcrumbExpandAndCollapse);
            },
        };
    },
};
/**
 * If the toggle button has a toggle arrow, rotate it when open and closed
 */
exports.rotateToggleIcon = {
    name: 'rotateToggleIcon',
    fn(instance) {
        const dropdownIcon = instance.reference.querySelector('.icon-arrow-down');
        if (!dropdownIcon) {
            return {};
        }
        return {
            onShow: () => dropdownIcon.classList.add('w-rotate-180'),
            onHide: () => dropdownIcon.classList.remove('w-rotate-180'),
        };
    },
};
/**
 * Default Tippy Tooltips
 */
function initTooltips() {
    (0, tippy_js_1.default)('[data-tippy-content]', {
        plugins: [exports.hideTooltipOnEsc],
    });
}
exports.initTooltips = initTooltips;
