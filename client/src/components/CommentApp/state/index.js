"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const redux_1 = require("redux");
const comments_1 = require("./comments");
const settings_1 = require("./settings");
exports.reducer = (0, redux_1.combineReducers)({
    comments: comments_1.reducer,
    settings: settings_1.reducer,
});
