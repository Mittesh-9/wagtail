"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const a11y_dialog_1 = __importDefault(require("a11y-dialog"));
const FLOATING = 'floating';
/**
 * Instantiates an a11y dialog on the controlled element.
 * Adds support for hide and show methods and blocking body
 * scroll when the dialog is open.
 *
 * @example
 * <div
 *    data-controller="w-dialog"
 *    data-w-dialog-theme-value="floating"
 *   >
 *    <div data-w-dialog-target="body"></div>
 *  </div>
 */
class DialogController extends stimulus_1.Controller {
    connect() {
        this.dialog = new a11y_dialog_1.default(this.element);
        const detail = { body: this.bodyTarget, dialog: this.dialog };
        const isFloating = this.themeValue === FLOATING;
        this.dialog
            .on('show', () => {
            if (!isFloating)
                document.documentElement.style.overflowY = 'hidden';
            this.dispatch('shown', { detail });
        })
            .on('hide', () => {
            if (!isFloating)
                document.documentElement.style.overflowY = '';
            this.dispatch('hidden', { detail });
        });
        this.dispatch('ready', { detail });
        return this.dialog;
    }
    hide() {
        this.dialog.hide();
    }
    show() {
        this.dialog.show();
    }
}
exports.DialogController = DialogController;
DialogController.values = {
    theme: { default: '', type: String },
};
DialogController.targets = ['body'];
