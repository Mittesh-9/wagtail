"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = void 0;
/**
 * Returns the value of the first argument. All others are ignored.
 *
 * @example
 * identity(7, 8, 9)
 * // 7
 */
const identity = (...args) => args[0];
exports.identity = identity;
