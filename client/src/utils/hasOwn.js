"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwn = void 0;
/**
 * Returns true if the specified object has the
 * indicated property as its own property.
 */
const hasOwn = (object, key) => object ? Object.prototype.hasOwnProperty.call(object, key) : false;
exports.hasOwn = hasOwn;
