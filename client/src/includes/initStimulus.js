"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStimulus = void 0;
const stimulus_1 = require("@hotwired/stimulus");
/**
 * Extend the Stimulus application class to provide some convenience
 * static attributes or methods to be accessed globally.
 */
class WagtailApplication extends stimulus_1.Application {
}
/**
 * Ensure the base Controller class is available for new controllers.
 */
WagtailApplication.Controller = stimulus_1.Controller;
/**
 * Function that accepts a plain old object and returns a Stimulus Controller.
 * Useful when ES6 modules with base class being extended not in use
 * or build tool not in use or for just super convenient class creation.
 *
 * Inspired heavily by
 * https://github.com/StackExchange/Stacks/blob/v1.6.5/lib/ts/stacks.ts#L84
 *
 * @example
 * createController({
 *   STATIC: { targets = ['container'] }
 *   connect() {
 *     console.log('connected', this.element, this.containerTarget);
 *   }
 * })
 *
 */
WagtailApplication.createController = (controllerDefinition = {}) => {
    class NewController extends stimulus_1.Controller {
    }
    const { STATIC = {} } = controllerDefinition, controllerDefinitionWithoutStatic = __rest(controllerDefinition, ["STATIC"]);
    // set up static values
    Object.entries(STATIC).forEach(([key, value]) => {
        NewController[key] = value;
    });
    // set up class methods
    Object.assign(NewController.prototype, controllerDefinitionWithoutStatic);
    return NewController;
};
/**
 * Initialises the Wagtail Stimulus application and dispatches and registers
 * custom event behaviour.
 *
 * Loads the supplied core controller definitions into the application.
 * Turns on debug mode if in local development (for now).
 */
const initStimulus = ({ debug = process.env.NODE_ENV === 'development', definitions = [], element = document.documentElement, } = {}) => {
    const application = WagtailApplication.start(element);
    application.debug = debug;
    application.load(definitions);
    return application;
};
exports.initStimulus = initStimulus;
