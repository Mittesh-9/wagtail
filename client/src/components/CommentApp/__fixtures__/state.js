"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicCommentsState = void 0;
const remoteReply = {
    localId: 2,
    remoteId: 2,
    mode: 'default',
    author: { id: 1, name: 'test user' },
    date: 0,
    text: 'a reply',
    originalText: 'a reply',
    newText: '',
    deleted: false,
};
const localReply = {
    localId: 3,
    remoteId: null,
    mode: 'default',
    author: { id: 1, name: 'test user' },
    date: 0,
    text: 'another reply',
    originalText: 'another new reply',
    newText: '',
    deleted: false,
};
const remoteComment = {
    contentpath: 'test_contentpath',
    position: '',
    localId: 1,
    annotation: null,
    remoteId: 1,
    mode: 'default',
    deleted: false,
    resolved: false,
    author: { id: 1, name: 'test user' },
    date: 0,
    text: 'test text',
    originalText: 'test text',
    newReply: '',
    newText: '',
    remoteReplyCount: 1,
    replies: new Map([
        [remoteReply.localId, remoteReply],
        [localReply.localId, localReply],
    ]),
};
const localComment = {
    contentpath: 'test_contentpath_2',
    position: '',
    localId: 4,
    annotation: null,
    remoteId: null,
    mode: 'default',
    deleted: false,
    resolved: false,
    author: { id: 1, name: 'test user' },
    date: 0,
    text: 'unsaved comment',
    originalText: 'unsaved comment',
    newReply: '',
    newText: '',
    replies: new Map(),
    remoteReplyCount: 0,
};
exports.basicCommentsState = {
    focusedComment: 1,
    forceFocus: false,
    pinnedComment: 1,
    remoteCommentCount: 1,
    comments: new Map([
        [remoteComment.localId, remoteComment],
        [localComment.localId, localComment],
    ]),
};
