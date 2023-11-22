"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFormSetComponent = exports.CommentFormComponent = exports.CommentReplyFormSetComponent = exports.CommentReplyFormComponent = void 0;
const react_1 = __importDefault(require("react"));
function PrefixedHiddenInput({ prefix, value, fieldName, }) {
    return (<input type="hidden" name={`${prefix}-${fieldName}`} value={value === null ? '' : value} id={`id_${prefix}-${fieldName}`}/>);
}
function CommentReplyFormComponent({ reply, formNumber, prefix, }) {
    const fullPrefix = `${prefix}-${formNumber}`;
    return (<fieldset>
      <PrefixedHiddenInput fieldName="DELETE" value={reply.deleted ? 1 : ''} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="id" value={reply.remoteId} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="text" value={reply.text} prefix={fullPrefix}/>
    </fieldset>);
}
exports.CommentReplyFormComponent = CommentReplyFormComponent;
function CommentReplyFormSetComponent({ replies, prefix, remoteReplyCount, }) {
    const fullPrefix = `${prefix}-replies`;
    const commentForms = replies.map((reply, formNumber) => (<CommentReplyFormComponent key={reply.localId} formNumber={formNumber} reply={reply} prefix={fullPrefix}/>));
    return (<>
      <PrefixedHiddenInput fieldName="TOTAL_FORMS" value={replies.length} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="INITIAL_FORMS" value={remoteReplyCount} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="MIN_NUM_FORMS" value="0" prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="MAX_NUM_FORMS" value="" prefix={fullPrefix}/>
      {commentForms}
    </>);
}
exports.CommentReplyFormSetComponent = CommentReplyFormSetComponent;
function CommentFormComponent({ comment, formNumber, prefix, }) {
    const fullPrefix = `${prefix}-${formNumber}`;
    return (<fieldset>
      <PrefixedHiddenInput fieldName="DELETE" value={comment.deleted ? 1 : ''} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="resolved" value={comment.resolved ? 1 : ''} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="id" value={comment.remoteId} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="contentpath" value={comment.contentpath} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="text" value={comment.text} prefix={fullPrefix}/>
      <PrefixedHiddenInput fieldName="position" value={comment.position} prefix={fullPrefix}/>
      <CommentReplyFormSetComponent replies={Array.from(comment.replies.values())} prefix={fullPrefix} remoteReplyCount={comment.remoteReplyCount}/>
    </fieldset>);
}
exports.CommentFormComponent = CommentFormComponent;
function CommentFormSetComponent({ comments, remoteCommentCount, }) {
    const prefix = 'comments';
    const commentForms = comments.map((comment, formNumber) => (<CommentFormComponent key={comment.localId} comment={comment} formNumber={formNumber} prefix={prefix}/>));
    return (<>
      <PrefixedHiddenInput fieldName="TOTAL_FORMS" value={comments.length} prefix={prefix}/>
      <PrefixedHiddenInput fieldName="INITIAL_FORMS" value={remoteCommentCount} prefix={prefix}/>
      <PrefixedHiddenInput fieldName="MIN_NUM_FORMS" value="0" prefix={prefix}/>
      <PrefixedHiddenInput fieldName="MAX_NUM_FORMS" value="" prefix={prefix}/>
      {commentForms}
    </>);
}
exports.CommentFormSetComponent = CommentFormSetComponent;
