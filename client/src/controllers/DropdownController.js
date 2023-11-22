"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const tippy_js_1 = __importDefault(require("tippy.js"));
const initTooltips_1 = require("../includes/initTooltips");
/**
 * A Tippy.js tooltip with interactive "dropdown" options.
 *
 * @example
 * <div data-controller="w-dropdown" data-w-dropdown-hide-on-click-value-"true">
 *  <button type="button" data-w-dropdown-target="toggle" aria-label="Actions"></button>
 *  <div data-w-dropdown-target="content">[…]</div>
 * </div>
 */
class DropdownController extends stimulus_1.Controller {
    connect() {
        this.tippy = (0, tippy_js_1.default)(this.toggleTarget, this.options);
    }
    hide() {
        var _a;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
    }
    show() {
        var _a;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
    }
    /**
     * Default Tippy Options
     */
    get options() {
        // If the dropdown toggle uses an ARIA label, use this as a hover tooltip.
        const hoverTooltip = this.toggleTarget.getAttribute('aria-label');
        let hoverTooltipInstance;
        if (this.hasContentTarget) {
            this.contentTarget.hidden = false;
        }
        if (hoverTooltip) {
            hoverTooltipInstance = (0, tippy_js_1.default)(this.toggleTarget, {
                content: hoverTooltip,
                placement: 'bottom',
                plugins: [initTooltips_1.hideTooltipOnEsc],
            });
        }
        const plugins = [
            initTooltips_1.hideTooltipOnEsc,
            initTooltips_1.hideTooltipOnBreadcrumbExpandAndCollapse,
            initTooltips_1.rotateToggleIcon,
        ];
        if (this.hideOnClickValue) {
            plugins.push(initTooltips_1.hideTooltipOnClickInside);
        }
        const onShown = () => {
            this.dispatch('shown', { target: window.document });
        };
        return Object.assign(Object.assign(Object.assign(Object.assign({}, (this.hasContentTarget
            ? { content: this.contentTarget }
            : {})), { trigger: 'click', interactive: true, theme: 'dropdown' }), (this.hasOffsetValue && { offset: this.offsetValue })), { placement: 'bottom', plugins,
            onShow() {
                if (hoverTooltipInstance) {
                    hoverTooltipInstance.disable();
                }
            },
            onShown() {
                onShown();
            },
            onHide() {
                if (hoverTooltipInstance) {
                    hoverTooltipInstance.enable();
                }
            } });
    }
}
exports.DropdownController = DropdownController;
DropdownController.targets = ['toggle', 'content'];
DropdownController.values = {
    hideOnClick: { default: false, type: Boolean },
    offset: Array,
};
