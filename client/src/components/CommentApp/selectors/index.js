"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCommentCount = exports.selectIsDirty = exports.selectCommentFactory = exports.selectCommentsForContentPathFactory = exports.selectRemoteCommentCount = exports.selectFocused = exports.selectComments = void 0;
const reselect_1 = require("reselect");
const selectComments = (state) => state.comments.comments;
exports.selectComments = selectComments;
const selectFocused = (state) => state.comments.focusedComment;
exports.selectFocused = selectFocused;
const selectRemoteCommentCount = (state) => state.comments.remoteCommentCount;
exports.selectRemoteCommentCount = selectRemoteCommentCount;
function selectCommentsForContentPathFactory(contentpath) {
    return (0, reselect_1.createSelector)(exports.selectComments, (comments) => [...comments.values()].filter((comment) => comment.contentpath === contentpath &&
        !(comment.deleted || comment.resolved)));
}
exports.selectCommentsForContentPathFactory = selectCommentsForContentPathFactory;
function selectCommentFactory(localId) {
    return (0, reselect_1.createSelector)(exports.selectComments, (comments) => {
        const comment = comments.get(localId);
        if (comment !== undefined && (comment.deleted || comment.resolved)) {
            return undefined;
        }
        return comment;
    });
}
exports.selectCommentFactory = selectCommentFactory;
exports.selectIsDirty = (0, reselect_1.createSelector)(exports.selectComments, exports.selectRemoteCommentCount, (comments, remoteCommentCount) => {
    if (remoteCommentCount !== comments.size) {
        return true;
    }
    return Array.from(comments.values()).some((comment) => {
        if (comment.deleted ||
            comment.resolved ||
            comment.replies.size !== comment.remoteReplyCount ||
            comment.originalText !== comment.text) {
            return true;
        }
        return Array.from(comment.replies.values()).some((reply) => reply.deleted || reply.originalText !== reply.text);
    });
});
const selectCommentCount = (state) => [...state.comments.comments.values()].filter((comment) => !comment.deleted && !comment.resolved).length;
exports.selectCommentCount = selectCommentCount;
