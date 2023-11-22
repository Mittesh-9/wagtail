"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleted = exports.deleteError = exports.deleting = exports.deleteConfirm = exports.saveError = exports.saving = exports.editing = exports.focused = exports.replyFromSomeoneElse = exports.reply = void 0;
const react_1 = __importDefault(require("react"));
const redux_1 = require("redux");
const state_1 = require("../../state");
const storybook_1 = require("../../utils/storybook");
exports.default = { title: 'Commenting/Comment Reply' };
function reply() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'default',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.reply = reply;
function replyFromSomeoneElse() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'default',
        text: 'An example reply',
        author: {
            id: 2,
            name: 'Someone else',
            avatarUrl: 'https://gravatar.com/avatar/31c3d5cc27d1faa321c2413589e8a53f?s=200&d=robohash&r=x',
        },
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.replyFromSomeoneElse = replyFromSomeoneElse;
function focused() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'default',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.focused = focused;
function editing() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'editing',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.editing = editing;
function saving() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'saving',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.saving = saving;
function saveError() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'save_error',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.saveError = saveError;
function deleteConfirm() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'delete_confirm',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleteConfirm = deleteConfirm;
function deleting() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'deleting',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleting = deleting;
function deleteError() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'delete_error',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleteError = deleteError;
function deleted() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    const commentId = (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    (0, storybook_1.addTestReply)(store, commentId, {
        mode: 'deleted',
        text: 'An example reply',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleted = deleted;
