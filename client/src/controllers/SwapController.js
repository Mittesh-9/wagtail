"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const debounce_1 = require("../utils/debounce");
const domReady_1 = require("../utils/domReady");
/**
 * Support legacy window global approach until header search
 * can fully adopt data-attributes.
 * @deprecated RemovedInWagtail60
 */
const getGlobalHeaderSearchOptions = () => window.headerSearch || {};
/**
 * Allow for an element to trigger an async query that will
 * patch the results into a results DOM container. The query
 * input can be the controlled element or the containing form.
 * It supports the ability to update the URL with the query
 * when processed or simply make a query based on a form's
 * values.
 *
 * @example - A form that will update the results based on the form's input
 *  <div id="results"></div>
 *  <form
 *    data-controller="w-swap"
 *    data-action="input->w-swap#submitLazy"
 *    data-w-swap-src-value="path/to/search"
 *    data-w-swap-target-value="#results"
 *  >
 *  <input id="search" type="text" name="query" />
 *  <input id="filter" type="text" name="filter" />
 * </form>
 *
 * @example - A single input that will update the results & the URL
 *  <div id="results"></div>
 *  <input
 *    id="search"
 *    type="text"
 *    name="q"
 *    data-controller="w-swap"
 *    data-action="input->w-swap#searchLazy"
 *    data-w-swap-src-value="path/to/search"
 *    data-w-swap-target-value="#listing-results"
 *  />
 *
 */
class SwapController extends stimulus_1.Controller {
    /**
     * Ensure we have backwards compatibility with setting window.headerSearch
     * and allowing for elements without a controller attached to be set up.
     *
     * @deprecated RemovedInWagtail60
     */
    static afterLoad(identifier, application) {
        const { actionAttribute, controllerAttribute } = application.schema;
        (0, domReady_1.domReady)().then(() => {
            const { termInput, targetOutput, url } = getGlobalHeaderSearchOptions();
            const input = termInput
                ? document.querySelector(termInput)
                : null;
            const form = input === null || input === void 0 ? void 0 : input.form;
            if (!form)
                return;
            if (!input.hasAttribute(`data-${identifier}-target`)) {
                input.setAttribute(`data-${identifier}-target`, 'input');
            }
            Object.entries({
                [controllerAttribute]: identifier,
                [actionAttribute]: [
                    `change->${identifier}#searchLazy`,
                    `input->${identifier}#searchLazy`,
                ].join(' '),
                [`data-${identifier}-src-value`]: url,
                [`data-${identifier}-target-value`]: targetOutput,
            }).forEach(([key, value]) => {
                if (!form.hasAttribute(key)) {
                    form.setAttribute(key, value);
                }
            });
        });
    }
    connect() {
        var _a;
        const formContainer = this.hasInputTarget
            ? this.inputTarget.form
            : this.element;
        this.srcValue =
            this.srcValue || (formContainer === null || formContainer === void 0 ? void 0 : formContainer.getAttribute('action')) || '';
        const target = this.target;
        // set up icons
        this.iconElement = null;
        const iconContainer = (this.hasInputTarget ? this.inputTarget : this.element).parentElement;
        this.iconElement = (iconContainer === null || iconContainer === void 0 ? void 0 : iconContainer.querySelector('use')) || null;
        this.iconValue = ((_a = this.iconElement) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
        // set up initial loading state (if set originally in the HTML)
        this.loadingValue = false;
        // set up debounced methods
        this.replaceLazy = (0, debounce_1.debounce)(this.replace.bind(this), this.waitValue);
        this.searchLazy = (0, debounce_1.debounce)(this.search.bind(this), this.waitValue);
        this.submitLazy = (0, debounce_1.debounce)(this.submit.bind(this), this.waitValue);
        // dispatch event for any initial action usage
        this.dispatch('ready', { cancelable: false, target });
    }
    /**
     * Element that receives the fetch result HTML output
     */
    get target() {
        const targetValue = this.targetValue;
        const targetElement = document.querySelector(targetValue);
        const foundTarget = targetElement && targetElement instanceof HTMLElement;
        const hasValidUrlValue = !!this.srcValue;
        const errors = [];
        if (!foundTarget) {
            errors.push(`Cannot find valid target element at "${targetValue}"`);
        }
        if (!hasValidUrlValue) {
            errors.push(`Cannot find valid src URL value`);
        }
        if (errors.length) {
            throw new Error(errors.join(', '));
        }
        return targetElement;
    }
    /**
     * Toggle the visual spinner icon if available and ensure content about
     * to be replaced is flagged as busy.
     */
    loadingValueChanged(isLoading, isLoadingPrevious) {
        var _a, _b;
        const target = isLoadingPrevious === undefined ? null : this.target; // ensure we avoid DOM interaction before connect
        if (isLoading) {
            target === null || target === void 0 ? void 0 : target.setAttribute('aria-busy', 'true');
            (_a = this.iconElement) === null || _a === void 0 ? void 0 : _a.setAttribute('href', '#icon-spinner');
        }
        else {
            target === null || target === void 0 ? void 0 : target.removeAttribute('aria-busy');
            (_b = this.iconElement) === null || _b === void 0 ? void 0 : _b.setAttribute('href', this.iconValue);
        }
    }
    /**
     * Perform a URL search param update based on the input's value with a comparison against the
     * matching URL search params. Will replace the target element's content with the results
     * of the async search request based on the query.
     *
     * Search will only be performed with the URL param value is different to the input value.
     * Cleared params will be removed from the URL if present.
     *
     * `clear` can be provided as Event detail or action param to override the default of 'p'.
     */
    search(data) {
        var _a, _b;
        /** Params to be cleared when updating the location (e.g. ['p'] for page). */
        const clearParams = (((_a = data === null || data === void 0 ? void 0 : data.detail) === null || _a === void 0 ? void 0 : _a.clear) ||
            ((_b = data === null || data === void 0 ? void 0 : data.params) === null || _b === void 0 ? void 0 : _b.clear) ||
            this.constructor.defaultClearParam).split(' ');
        const searchInput = this.hasInputTarget ? this.inputTarget : this.element;
        const queryParam = searchInput.name;
        const searchParams = new URLSearchParams(window.location.search);
        const currentQuery = searchParams.get(queryParam) || '';
        const newQuery = searchInput.value || '';
        // only do the query if it has changed for trimmed queries
        // for example - " " === "" and "first word " ==== "first word"
        if (currentQuery.trim() === newQuery.trim())
            return;
        // Update search query param ('q') to the new value or remove if empty
        if (newQuery) {
            searchParams.set(queryParam, newQuery);
        }
        else {
            searchParams.delete(queryParam);
        }
        // clear any params (e.g. page/p) if needed
        clearParams.forEach((param) => {
            searchParams.delete(param);
        });
        const queryString = '?' + searchParams.toString();
        const url = this.srcValue;
        this.replace(url + queryString).then(() => {
            window.history.replaceState(null, '', queryString);
        });
    }
    /**
     * Update the target element's content with the response from a request based on the input's form
     * values serialised. Do not account for anything in the main location/URL, simply replace the content within
     * the target element.
     */
    submit() {
        const form = (this.hasInputTarget ? this.inputTarget.form : this.element);
        // serialise the form to a query string
        // https://github.com/microsoft/TypeScript/issues/43797
        const searchParams = new URLSearchParams(new FormData(form));
        const queryString = '?' + searchParams.toString();
        const url = this.srcValue;
        this.replace(url + queryString);
    }
    /**
     * Abort any existing requests & set up new abort controller, then fetch and replace
     * the HTML target with the new results.
     * Cancel any in progress results request using the AbortController so that
     * a faster response does not replace an in flight request.
     */
    replace(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const target = this.target;
            /** Parse a request URL from the supplied param, as a string or inside a custom event */
            const requestUrl = (typeof data === 'string'
                ? data
                : ((_a = data === null || data === void 0 ? void 0 : data.detail) === null || _a === void 0 ? void 0 : _a.url) || ((_b = data === null || data === void 0 ? void 0 : data.params) === null || _b === void 0 ? void 0 : _b.url) || '') || this.srcValue;
            if (this.abortController)
                this.abortController.abort();
            this.abortController = new AbortController();
            const { signal } = this.abortController;
            this.loadingValue = true;
            const beginEvent = this.dispatch('begin', {
                cancelable: true,
                detail: { requestUrl },
                target: this.target,
            });
            if (beginEvent.defaultPrevented)
                return Promise.resolve();
            return fetch(requestUrl, {
                headers: { 'x-requested-with': 'XMLHttpRequest' },
                signal,
            })
                .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
                .then((results) => {
                target.innerHTML = results;
                this.dispatch('success', {
                    cancelable: false,
                    detail: { requestUrl, results },
                    target,
                });
                return results;
            })
                .catch((error) => {
                if (signal.aborted)
                    return;
                this.dispatch('error', {
                    cancelable: false,
                    detail: { error, requestUrl },
                    target,
                });
                // eslint-disable-next-line no-console
                console.error(`Error fetching ${requestUrl}`, error);
            })
                .finally(() => {
                var _a;
                if (signal === ((_a = this.abortController) === null || _a === void 0 ? void 0 : _a.signal)) {
                    this.loadingValue = false;
                }
            });
        });
    }
    /**
     * When disconnecting, ensure we reset any visual related state values and
     * cancel any in-flight requests.
     */
    disconnect() {
        var _a, _b, _c;
        this.loadingValue = false;
        (_a = this.replaceLazy) === null || _a === void 0 ? void 0 : _a.cancel();
        (_b = this.searchLazy) === null || _b === void 0 ? void 0 : _b.cancel();
        (_c = this.submitLazy) === null || _c === void 0 ? void 0 : _c.cancel();
    }
}
exports.SwapController = SwapController;
SwapController.defaultClearParam = 'p';
SwapController.targets = ['input'];
SwapController.values = {
    icon: { default: '', type: String },
    loading: { default: false, type: Boolean },
    src: { default: '', type: String },
    target: { default: '#listing-results', type: String },
    wait: { default: 200, type: Number },
};
