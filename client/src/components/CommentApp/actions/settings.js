"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGlobalSettings = exports.UPDATE_GLOBAL_SETTINGS = void 0;
exports.UPDATE_GLOBAL_SETTINGS = 'update-global-settings';
function updateGlobalSettings(update) {
    return {
        type: exports.UPDATE_GLOBAL_SETTINGS,
        update,
    };
}
exports.updateGlobalSettings = updateGlobalSettings;
