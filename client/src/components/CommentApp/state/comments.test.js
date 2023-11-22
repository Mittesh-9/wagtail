"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const state_1 = require("../__fixtures__/state");
const comments_1 = require("./comments");
const actions = __importStar(require("../actions/comments"));
test('Initial comments state empty', () => {
    const state = (0, redux_1.createStore)(comments_1.reducer).getState();
    expect(state.focusedComment).toBe(null);
    expect(state.pinnedComment).toBe(null);
    expect(state.comments.size).toBe(0);
    expect(state.remoteCommentCount).toBe(0);
});
test('New comment added to state', () => {
    const newComment = {
        contentpath: 'test_contentpath',
        position: '',
        localId: 5,
        annotation: null,
        remoteId: null,
        mode: 'default',
        deleted: false,
        author: { id: 1, name: 'test user' },
        date: 0,
        text: 'new comment',
        originalText: 'new comment',
        newReply: '',
        newText: '',
        remoteReplyCount: 0,
        resolved: false,
        replies: new Map(),
    };
    const commentAction = actions.addComment(newComment);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, commentAction);
    expect(newState.comments.get(newComment.localId)).toBe(newComment);
    expect(newState.remoteCommentCount).toBe(state_1.basicCommentsState.remoteCommentCount);
});
test('Remote comment added to state', () => {
    const newComment = {
        contentpath: 'test_contentpath',
        position: '',
        localId: 5,
        annotation: null,
        remoteId: 10,
        mode: 'default',
        deleted: false,
        resolved: false,
        author: { id: 1, name: 'test user' },
        date: 0,
        text: 'new comment',
        originalText: 'new comment',
        newReply: '',
        newText: '',
        remoteReplyCount: 0,
        replies: new Map(),
    };
    const commentAction = actions.addComment(newComment);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, commentAction);
    expect(newState.comments.get(newComment.localId)).toBe(newComment);
    expect(newState.remoteCommentCount).toBe(state_1.basicCommentsState.remoteCommentCount + 1);
});
test('Existing comment updated', () => {
    const commentUpdate = {
        mode: 'editing',
    };
    const updateAction = actions.updateComment(1, commentUpdate);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, updateAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        expect(comment.mode).toBe('editing');
    }
});
test('Local comment deleted', () => {
    // Test that deleting a comment without a remoteId removes it from the state entirely
    const deleteAction = actions.deleteComment(4);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, deleteAction);
    expect(newState.comments.has(4)).toBe(false);
});
test('Local comment resolved', () => {
    // Test that resolving a comment without a remoteId removes it from the state entirely
    const resolveAction = actions.resolveComment(4);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, resolveAction);
    expect(newState.comments.has(4)).toBe(false);
});
test('Remote comment deleted', () => {
    // Test that deleting a comment without a remoteId does not remove it from the state, but marks it as deleted
    const deleteAction = actions.deleteComment(1);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, deleteAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        expect(comment.deleted).toBe(true);
    }
    expect(newState.focusedComment).toBe(null);
    expect(newState.pinnedComment).toBe(null);
    expect(newState.remoteCommentCount).toBe(state_1.basicCommentsState.remoteCommentCount);
});
test('Remote comment resolved', () => {
    // Test that resolving a comment without a remoteId does not remove it from the state, but marks it as resolved
    const resolveAction = actions.resolveComment(1);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, resolveAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        expect(comment.resolved).toBe(true);
    }
    expect(newState.focusedComment).toBe(null);
    expect(newState.pinnedComment).toBe(null);
    expect(newState.remoteCommentCount).toBe(state_1.basicCommentsState.remoteCommentCount);
});
test('Comment focused', () => {
    const focusAction = actions.setFocusedComment(4, {
        updatePinnedComment: true,
        forceFocus: true,
    });
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, focusAction);
    expect(newState.focusedComment).toBe(4);
    expect(newState.pinnedComment).toBe(4);
    expect(newState.forceFocus).toBe(true);
});
test('Invalid comment not focused', () => {
    const focusAction = actions.setFocusedComment(9000, {
        updatePinnedComment: true,
        forceFocus: true,
    });
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, focusAction);
    expect(newState.focusedComment).toBe(state_1.basicCommentsState.focusedComment);
    expect(newState.pinnedComment).toBe(state_1.basicCommentsState.pinnedComment);
    expect(newState.forceFocus).toBe(false);
});
test('Reply added', () => {
    const reply = {
        localId: 10,
        remoteId: null,
        mode: 'default',
        author: { id: 1, name: 'test user' },
        date: 0,
        text: 'a new reply',
        originalText: 'a new reply',
        newText: '',
        deleted: false,
    };
    const addAction = actions.addReply(1, reply);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, addAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        const stateReply = comment.replies.get(10);
        expect(stateReply).toBeDefined();
        if (stateReply) {
            expect(stateReply).toBe(reply);
        }
    }
});
test('Remote reply added', () => {
    const reply = {
        localId: 10,
        remoteId: 1,
        mode: 'default',
        author: { id: 1, name: 'test user' },
        date: 0,
        text: 'a new reply',
        originalText: 'a new reply',
        newText: '',
        deleted: false,
    };
    const addAction = actions.addReply(1, reply);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, addAction);
    const originalComment = state_1.basicCommentsState.comments.get(1);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        const stateReply = comment.replies.get(reply.localId);
        expect(stateReply).toBeDefined();
        expect(stateReply).toBe(reply);
        if (originalComment) {
            expect(comment.remoteReplyCount).toBe(originalComment.remoteReplyCount + 1);
        }
    }
});
test('Reply updated', () => {
    const replyUpdate = {
        mode: 'editing',
    };
    const updateAction = actions.updateReply(1, 2, replyUpdate);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, updateAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        const reply = comment.replies.get(2);
        expect(reply).toBeDefined();
        if (reply) {
            expect(reply.mode).toBe('editing');
        }
    }
});
test('Local reply deleted', () => {
    // Test that the delete action deletes a reply that hasn't yet been saved to the db from the state entirely
    const deleteAction = actions.deleteReply(1, 3);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, deleteAction);
    const comment = newState.comments.get(1);
    expect(comment).toBeDefined();
    if (comment) {
        expect(comment.replies.has(3)).toBe(false);
    }
});
test('Remote reply deleted', () => {
    // Test that the delete action deletes a reply that has been saved to the db by marking it as deleted instead
    const deleteAction = actions.deleteReply(1, 2);
    const newState = (0, comments_1.reducer)(state_1.basicCommentsState, deleteAction);
    const comment = newState.comments.get(1);
    const originalComment = state_1.basicCommentsState.comments.get(1);
    expect(comment).toBeDefined();
    expect(originalComment).toBeDefined();
    if (comment && originalComment) {
        expect(comment.remoteReplyCount).toBe(originalComment.remoteReplyCount);
        const reply = comment.replies.get(2);
        expect(reply).toBeDefined();
        if (reply) {
            expect(reply.deleted).toBe(true);
        }
    }
});
