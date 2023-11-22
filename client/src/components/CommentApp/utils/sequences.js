"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextReplyId = exports.getNextCommentId = void 0;
let nextCommentId = 1;
let nextReplyId = 1;
function getNextCommentId() {
    nextCommentId += 1;
    return nextCommentId;
}
exports.getNextCommentId = getNextCommentId;
function getNextReplyId() {
    nextReplyId += 1;
    return nextReplyId;
}
exports.getNextReplyId = getNextReplyId;
