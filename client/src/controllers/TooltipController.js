"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const tippy_js_1 = __importDefault(require("tippy.js"));
const initTooltips_1 = require("../includes/initTooltips");
/**
 * A Tippy.js tooltip with simple popover content.
 *
 * @example
 * <button type="button" data-controller="w-tooltip" data-w-tooltip-content-value="More detail here">
 *  A button with a tooltip
 * </button>
 */
class TooltipController extends stimulus_1.Controller {
    connect() {
        this.tippy = (0, tippy_js_1.default)(this.element, this.options);
    }
    contentValueChanged(newValue, oldValue) {
        var _a;
        if (!oldValue || oldValue === newValue)
            return;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.setProps(this.options);
    }
    placementValueChanged(newValue, oldValue) {
        var _a;
        if (!oldValue || oldValue === newValue)
            return;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.setProps(this.options);
    }
    hide() {
        var _a;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
    }
    show() {
        var _a;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
    }
    get options() {
        return Object.assign({ content: this.contentValue, placement: this.placementValue, plugins: [initTooltips_1.hideTooltipOnEsc] }, (this.hasOffsetValue && { offset: this.offsetValue }));
    }
    disconnect() {
        var _a;
        (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}
exports.TooltipController = TooltipController;
TooltipController.values = {
    content: String,
    offset: Array,
    placement: { default: 'bottom', type: String },
};
