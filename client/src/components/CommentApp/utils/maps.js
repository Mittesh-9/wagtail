"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrDefault = void 0;
function getOrDefault(map, key, defaultValue) {
    const value = map.get(key);
    if (typeof value === 'undefined') {
        return defaultValue;
    }
    return value;
}
exports.getOrDefault = getOrDefault;
