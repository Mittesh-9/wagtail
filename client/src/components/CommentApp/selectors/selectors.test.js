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
const state_1 = require("../__fixtures__/state");
const settings_1 = require("../state/settings");
const comments_1 = require("../state/comments");
const state_2 = require("../state");
const actions = __importStar(require("../actions/comments"));
const index_1 = require("./index");
test('Select comments for contentpath', () => {
    // test that the selectCommentsForContentPathFactory can generate selectors for the two
    // contentpaths in basicCommentsState
    const state = {
        comments: state_1.basicCommentsState,
        settings: settings_1.INITIAL_STATE,
    };
    const testContentPathSelector = (0, index_1.selectCommentsForContentPathFactory)('test_contentpath');
    const testContentPathSelector2 = (0, index_1.selectCommentsForContentPathFactory)('test_contentpath_2');
    const selectedComments = testContentPathSelector(state);
    expect(selectedComments.length).toBe(1);
    expect(selectedComments[0].contentpath).toBe('test_contentpath');
    const otherSelectedComments = testContentPathSelector2(state);
    expect(otherSelectedComments.length).toBe(1);
    expect(otherSelectedComments[0].contentpath).toBe('test_contentpath_2');
});
test('Select is dirty', () => {
    const state = {
        comments: comments_1.INITIAL_STATE,
        settings: settings_1.INITIAL_STATE,
    };
    const stateWithUnsavedComment = (0, state_2.reducer)(state, actions.addComment((0, comments_1.newComment)('test_contentpath', 'test_position', 1, null, null, 0, {
        remoteId: null,
        text: 'my new comment',
    })));
    expect((0, index_1.selectIsDirty)(stateWithUnsavedComment)).toBe(true);
    const stateWithSavedComment = (0, state_2.reducer)(state, actions.addComment((0, comments_1.newComment)('test_contentpath', 'test_position', 1, null, null, 0, {
        remoteId: 1,
        text: 'my saved comment',
    })));
    expect((0, index_1.selectIsDirty)(stateWithSavedComment)).toBe(false);
    const stateWithDeletedComment = (0, state_2.reducer)(stateWithSavedComment, actions.deleteComment(1));
    expect((0, index_1.selectIsDirty)(stateWithDeletedComment)).toBe(true);
    const stateWithResolvedComment = (0, state_2.reducer)(stateWithSavedComment, actions.updateComment(1, { resolved: true }));
    expect((0, index_1.selectIsDirty)(stateWithResolvedComment)).toBe(true);
    const stateWithEditedComment = (0, state_2.reducer)(stateWithSavedComment, actions.updateComment(1, { text: 'edited_text' }));
    expect((0, index_1.selectIsDirty)(stateWithEditedComment)).toBe(true);
    const stateWithUnsavedReply = (0, state_2.reducer)(stateWithSavedComment, actions.addReply(1, (0, comments_1.newCommentReply)(2, null, 0, {
        remoteId: null,
        text: 'new reply',
    })));
    expect((0, index_1.selectIsDirty)(stateWithUnsavedReply)).toBe(true);
    const stateWithSavedReply = (0, state_2.reducer)(stateWithSavedComment, actions.addReply(1, (0, comments_1.newCommentReply)(2, null, 0, {
        remoteId: 2,
        text: 'new saved reply',
    })));
    expect((0, index_1.selectIsDirty)(stateWithSavedReply)).toBe(false);
    const stateWithDeletedReply = (0, state_2.reducer)(stateWithSavedReply, actions.deleteReply(1, 2));
    expect((0, index_1.selectIsDirty)(stateWithDeletedReply)).toBe(true);
    const stateWithEditedReply = (0, state_2.reducer)(stateWithSavedReply, actions.updateReply(1, 2, { text: 'edited_text' }));
    expect((0, index_1.selectIsDirty)(stateWithEditedReply)).toBe(true);
});
