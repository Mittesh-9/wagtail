"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutosizeController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const autosize_1 = __importDefault(require("autosize"));
const debounce_1 = require("../utils/debounce");
/**
 * Adds the ability for a text area element to be auto-sized as the user
 * types in the field so that it expands to show all content.
 *
 * @example
 * <textarea data-controller="w-autosize"></textarea>
 */
class AutosizeController extends stimulus_1.Controller {
    resize() {
        autosize_1.default.update(this.element);
    }
    initialize() {
        this.resize = (0, debounce_1.debounce)(this.resize.bind(this), 50);
    }
    connect() {
        (0, autosize_1.default)(this.element);
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.element);
    }
    disconnect() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        autosize_1.default.destroy(this.element);
    }
}
exports.AutosizeController = AutosizeController;
