"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
/**
 * Creates an array of numbers progressing from start up to, but not including, end.
 */
const range = (min = 0, max = 0) => [...Array(max - min).keys()].map((i) => i + min);
exports.range = range;
