"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentActionFunctions = exports.invalidateContentPath = exports.deleteReply = exports.updateReply = exports.addReply = exports.setFocusedComment = exports.resolveComment = exports.deleteComment = exports.updateComment = exports.addComment = exports.INVALIDATE_CONTENT_PATH = exports.DELETE_REPLY = exports.UPDATE_REPLY = exports.ADD_REPLY = exports.SET_PINNED_COMMENT = exports.SET_FOCUSED_COMMENT = exports.RESOLVE_COMMENT = exports.DELETE_COMMENT = exports.UPDATE_COMMENT = exports.ADD_COMMENT = void 0;
exports.ADD_COMMENT = 'add-comment';
exports.UPDATE_COMMENT = 'update-comment';
exports.DELETE_COMMENT = 'delete-comment';
exports.RESOLVE_COMMENT = 'resolve-comment';
exports.SET_FOCUSED_COMMENT = 'set-focused-comment';
exports.SET_PINNED_COMMENT = 'set-pinned-comment';
exports.ADD_REPLY = 'add-reply';
exports.UPDATE_REPLY = 'update-reply';
exports.DELETE_REPLY = 'delete-reply';
exports.INVALIDATE_CONTENT_PATH = 'invalidate-content-path';
function addComment(comment) {
    return {
        type: exports.ADD_COMMENT,
        comment,
    };
}
exports.addComment = addComment;
function updateComment(commentId, update) {
    return {
        type: exports.UPDATE_COMMENT,
        commentId,
        update,
    };
}
exports.updateComment = updateComment;
function deleteComment(commentId) {
    return {
        type: exports.DELETE_COMMENT,
        commentId,
    };
}
exports.deleteComment = deleteComment;
function resolveComment(commentId) {
    return {
        type: exports.RESOLVE_COMMENT,
        commentId,
    };
}
exports.resolveComment = resolveComment;
function setFocusedComment(commentId, { updatePinnedComment, forceFocus } = {
    updatePinnedComment: false,
    forceFocus: false,
}) {
    return {
        type: exports.SET_FOCUSED_COMMENT,
        commentId,
        updatePinnedComment,
        forceFocus,
    };
}
exports.setFocusedComment = setFocusedComment;
function addReply(commentId, reply) {
    return {
        type: exports.ADD_REPLY,
        commentId,
        reply,
    };
}
exports.addReply = addReply;
function updateReply(commentId, replyId, update) {
    return {
        type: exports.UPDATE_REPLY,
        commentId,
        replyId,
        update,
    };
}
exports.updateReply = updateReply;
function deleteReply(commentId, replyId) {
    return {
        type: exports.DELETE_REPLY,
        commentId,
        replyId,
    };
}
exports.deleteReply = deleteReply;
function invalidateContentPath(contentPath) {
    return {
        type: exports.INVALIDATE_CONTENT_PATH,
        contentPath,
    };
}
exports.invalidateContentPath = invalidateContentPath;
exports.commentActionFunctions = {
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
    setFocusedComment,
    addReply,
    updateReply,
    deleteReply,
    invalidateContentPath,
};
