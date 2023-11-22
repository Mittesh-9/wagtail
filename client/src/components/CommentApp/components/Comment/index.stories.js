"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteError = exports.deleting = exports.deleteConfirm = exports.saveError = exports.saving = exports.focused = exports.commentFromSomeoneWithAReallyLongName = exports.commentFromSomeoneElseWithoutAvatar = exports.commentFromSomeoneElse = exports.comment = exports.addNewComment = void 0;
const react_1 = __importDefault(require("react"));
const redux_1 = require("redux");
const state_1 = require("../../state");
const storybook_1 = require("../../utils/storybook");
exports.default = { title: 'Commenting/Comment' };
function addNewComment() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'creating',
        focused: true,
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.addNewComment = addNewComment;
function comment() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.comment = comment;
function commentFromSomeoneElse() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        author: {
            id: 2,
            name: 'Someone else',
            avatarUrl: 'https://gravatar.com/avatar/31c3d5cc27d1faa321c2413589e8a53f?s=200&d=robohash&r=x',
        },
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.commentFromSomeoneElse = commentFromSomeoneElse;
function commentFromSomeoneElseWithoutAvatar() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        author: {
            id: 2,
            name: 'Someone else',
        },
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.commentFromSomeoneElseWithoutAvatar = commentFromSomeoneElseWithoutAvatar;
function commentFromSomeoneWithAReallyLongName() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        author: {
            id: 1,
            name: 'This person has a really long name and it should wrap to the next line',
            avatarUrl: 'https://gravatar.com/avatar/31c3d5cc27d1faa321c2413589e8a53f?s=200&d=robohash&r=x',
        },
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.commentFromSomeoneWithAReallyLongName = commentFromSomeoneWithAReallyLongName;
function focused() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'default',
        text: 'An example comment',
        focused: true,
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.focused = focused;
function saving() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'saving',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.saving = saving;
function saveError() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'save_error',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.saveError = saveError;
function deleteConfirm() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'delete_confirm',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleteConfirm = deleteConfirm;
function deleting() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'deleting',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleting = deleting;
function deleteError() {
    const store = (0, redux_1.createStore)(state_1.reducer);
    (0, storybook_1.addTestComment)(store, {
        mode: 'delete_error',
        text: 'An example comment',
    });
    return <storybook_1.RenderCommentsForStorybook store={store}/>;
}
exports.deleteError = deleteError;
