"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipLinkController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
/**
 * Appears at the top left corner of the admin page with the tab button is clicked.
 * Used to provide an accessible skip button for keyboard control so that users can
 * easily navigate to the main content without having to navigate a long list of navigation links.
 *
 * Inspired by https://github.com/selfthinker/dokuwiki_template_writr/blob/master/js/skip-link-focus-fix.js
 */
class SkipLinkController extends stimulus_1.Controller {
    connect() {
        this.skipToTarget = document.querySelector(this.element.getAttribute('href') || 'main');
    }
    handleBlur() {
        if (!this.skipToTarget)
            return;
        this.skipToTarget.removeAttribute('tabindex');
        this.skipToTarget.removeEventListener('blur', this.handleBlur);
        this.skipToTarget.removeEventListener('focusout', this.handleBlur);
    }
    skip() {
        if (!this.skipToTarget)
            return;
        this.skipToTarget.setAttribute('tabindex', '-1');
        this.skipToTarget.addEventListener('blur', this.handleBlur);
        this.skipToTarget.addEventListener('focusout', this.handleBlur);
        this.skipToTarget.focus();
    }
}
exports.SkipLinkController = SkipLinkController;
