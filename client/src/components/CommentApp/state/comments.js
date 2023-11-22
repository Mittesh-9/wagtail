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
exports.reducer = exports.INITIAL_STATE = exports.newComment = exports.newCommentReply = void 0;
const immer_1 = __importStar(require("immer"));
const actions = __importStar(require("../actions/comments"));
(0, immer_1.enableES5)();
(0, immer_1.enableMapSet)();
function newCommentReply(localId, author, date, { remoteId = null, mode = 'default', text = '', deleted = false, }) {
    return {
        localId,
        remoteId,
        mode,
        author,
        date,
        text,
        originalText: text,
        newText: '',
        deleted,
    };
}
exports.newCommentReply = newCommentReply;
function newComment(contentpath, position, localId, annotation, author, date, { remoteId = null, mode = 'default', text = '', resolved = false, deleted = false, replies = new Map(), }) {
    return {
        contentpath,
        position,
        localId,
        annotation,
        remoteId,
        mode,
        author,
        date,
        text,
        originalText: text,
        replies,
        newReply: '',
        newText: '',
        deleted,
        resolved,
        remoteReplyCount: Array.from(replies.values()).reduce((n, reply) => (reply.remoteId !== null ? n + 1 : n), 0),
    };
}
exports.newComment = newComment;
exports.INITIAL_STATE = {
    comments: new Map(),
    forceFocus: false,
    focusedComment: null,
    pinnedComment: null,
    remoteCommentCount: 0,
};
exports.reducer = (0, immer_1.default)((draft, action) => {
    /* eslint-disable no-param-reassign */
    const deleteComment = (comment) => {
        if (!comment.remoteId) {
            // If the comment doesn't exist in the database, there's no need to keep it around locally
            draft.comments.delete(comment.localId);
        }
        else {
            comment.deleted = true;
        }
        // Unset focusedComment if the focused comment is the one being deleted
        if (draft.focusedComment === comment.localId) {
            draft.focusedComment = null;
            draft.forceFocus = false;
        }
        if (draft.pinnedComment === comment.localId) {
            draft.pinnedComment = null;
        }
    };
    const resolveComment = (comment) => {
        if (!comment.remoteId) {
            // If the comment doesn't exist in the database, there's no need to keep it around locally
            draft.comments.delete(comment.localId);
        }
        else {
            comment.resolved = true;
        }
        // Unset focusedComment if the focused comment is the one being resolved
        if (draft.focusedComment === comment.localId) {
            draft.focusedComment = null;
        }
        if (draft.pinnedComment === comment.localId) {
            draft.pinnedComment = null;
        }
    };
    switch (action.type) {
        case actions.ADD_COMMENT: {
            draft.comments.set(action.comment.localId, action.comment);
            if (action.comment.remoteId) {
                draft.remoteCommentCount += 1;
            }
            break;
        }
        case actions.UPDATE_COMMENT: {
            const comment = draft.comments.get(action.commentId);
            if (comment) {
                if (action.update.newText && action.update.newText.length === 0) {
                    break;
                }
                Object.assign(comment, action.update);
            }
            break;
        }
        case actions.DELETE_COMMENT: {
            const comment = draft.comments.get(action.commentId);
            if (!comment) {
                break;
            }
            deleteComment(comment);
            break;
        }
        case actions.RESOLVE_COMMENT: {
            const comment = draft.comments.get(action.commentId);
            if (!comment) {
                break;
            }
            resolveComment(comment);
            break;
        }
        case actions.SET_FOCUSED_COMMENT: {
            if (action.commentId === null || draft.comments.has(action.commentId)) {
                draft.focusedComment = action.commentId;
                if (action.updatePinnedComment) {
                    draft.pinnedComment = action.commentId;
                }
                draft.forceFocus = action.forceFocus;
            }
            break;
        }
        case actions.ADD_REPLY: {
            const comment = draft.comments.get(action.commentId);
            if (!comment || action.reply.text.length === 0) {
                break;
            }
            if (action.reply.remoteId) {
                comment.remoteReplyCount += 1;
            }
            comment.replies.set(action.reply.localId, action.reply);
            break;
        }
        case actions.UPDATE_REPLY: {
            const comment = draft.comments.get(action.commentId);
            if (!comment) {
                break;
            }
            const reply = comment.replies.get(action.replyId);
            if (!reply) {
                break;
            }
            if (action.update.newText && action.update.newText.length === 0) {
                break;
            }
            Object.assign(reply, action.update);
            break;
        }
        case actions.DELETE_REPLY: {
            const comment = draft.comments.get(action.commentId);
            if (!comment) {
                break;
            }
            const reply = comment.replies.get(action.replyId);
            if (!reply) {
                break;
            }
            if (!reply.remoteId) {
                // The reply doesn't exist in the database, so we don't need to store it locally
                comment.replies.delete(reply.localId);
            }
            else {
                reply.deleted = true;
            }
            break;
        }
        case actions.INVALIDATE_CONTENT_PATH: {
            // Delete any comments that exist in the contentpath
            const comments = draft.comments;
            for (const comment of comments.values()) {
                if (comment.contentpath.startsWith(action.contentPath)) {
                    resolveComment(comment);
                }
            }
            break;
        }
        default:
            break;
    }
}, exports.INITIAL_STATE);
