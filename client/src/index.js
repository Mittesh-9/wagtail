"use strict";
/**
 * Entry point for the wagtail package.
 * Re-exports components and other modules via a cleaner API.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = exports.PublicationStatus = exports.Portal = exports.LoadingSpinner = exports.Icon = exports.Button = void 0;
var Button_1 = require("./components/Button/Button");
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return __importDefault(Button_1).default; } });
var Icon_1 = require("./components/Icon/Icon");
Object.defineProperty(exports, "Icon", { enumerable: true, get: function () { return __importDefault(Icon_1).default; } });
var LoadingSpinner_1 = require("./components/LoadingSpinner/LoadingSpinner");
Object.defineProperty(exports, "LoadingSpinner", { enumerable: true, get: function () { return __importDefault(LoadingSpinner_1).default; } });
var Portal_1 = require("./components/Portal/Portal");
Object.defineProperty(exports, "Portal", { enumerable: true, get: function () { return __importDefault(Portal_1).default; } });
var PublicationStatus_1 = require("./components/PublicationStatus/PublicationStatus");
Object.defineProperty(exports, "PublicationStatus", { enumerable: true, get: function () { return __importDefault(PublicationStatus_1).default; } });
var Transition_1 = require("./components/Transition/Transition");
Object.defineProperty(exports, "Transition", { enumerable: true, get: function () { return __importDefault(Transition_1).default; } });
