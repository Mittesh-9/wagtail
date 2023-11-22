"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const focus_trap_react_1 = __importDefault(require("focus-trap-react"));
const gettext_1 = require("../../../../utils/gettext");
const Icon_1 = __importDefault(require("../../../Icon/Icon"));
const comments_1 = require("../../state/comments");
const comments_2 = require("../../actions/comments");
const sequences_1 = require("../../utils/sequences");
const CommentReply_1 = __importDefault(require("../CommentReply"));
const CommentHeader_1 = require("../CommentHeader");
const TextArea_1 = __importDefault(require("../TextArea"));
function saveComment(comment, store) {
    return __awaiter(this, void 0, void 0, function* () {
        store.dispatch((0, comments_2.updateComment)(comment.localId, {
            mode: 'saving',
        }));
        try {
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'default',
                text: comment.newText,
                remoteId: comment.remoteId,
                author: comment.author,
                date: comment.date,
            }));
        }
        catch (err) {
            /* eslint-disable-next-line no-console */
            console.error(err);
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'save_error',
            }));
        }
    });
}
function doDeleteComment(comment, store) {
    return __awaiter(this, void 0, void 0, function* () {
        store.dispatch((0, comments_2.updateComment)(comment.localId, {
            mode: 'deleting',
        }));
        try {
            store.dispatch((0, comments_2.deleteComment)(comment.localId));
        }
        catch (err) {
            /* eslint-disable-next-line no-console */
            console.error(err);
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'delete_error',
            }));
        }
    });
}
function doResolveComment(comment, store) {
    store.dispatch((0, comments_2.resolveComment)(comment.localId));
}
class CommentComponent extends react_1.default.Component {
    renderReplies({ hideNewReply = false } = {}) {
        const { comment, isFocused, store, user } = this.props;
        if (!comment.remoteId) {
            // Hide replies UI if the comment itself isn't saved yet
            return null;
        }
        const onChangeNewReply = (value) => {
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                newReply: value,
            }));
        };
        const sendReply = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const replyId = (0, sequences_1.getNextReplyId)();
            const reply = (0, comments_1.newCommentReply)(replyId, user, Date.now(), {
                text: comment.newReply,
                mode: 'default',
            });
            store.dispatch((0, comments_2.addReply)(comment.localId, reply));
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                newReply: '',
            }));
        });
        const onClickCancelReply = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                newReply: '',
            }));
            store.dispatch((0, comments_2.setFocusedComment)(null));
            // Stop the event bubbling so that the comment isn't immediately refocused
            e.stopPropagation();
        };
        const replies = [];
        let replyBeingEdited = false;
        for (const reply of comment.replies.values()) {
            if (reply.mode === 'saving' || reply.mode === 'editing') {
                replyBeingEdited = true;
            }
            if (!reply.deleted) {
                replies.push(<CommentReply_1.default key={reply.localId} store={store} user={user} comment={comment} reply={reply} isFocused={isFocused}/>);
            }
        }
        // Hide new reply if a reply is being edited as well
        const newReplyHidden = hideNewReply || replyBeingEdited;
        let replyForm;
        if (!newReplyHidden && (isFocused || comment.newReply)) {
            replyForm = (<form onSubmit={sendReply}>
          <TextArea_1.default className="comment__reply-input" placeholder={(0, gettext_1.gettext)('Enter your reply...')} value={comment.newReply} onChange={onChangeNewReply}/>
          <div className="comment__reply-actions">
            <button disabled={comment.newReply.length === 0} type="submit" className="comment__button comment__button--primary">
              {(0, gettext_1.gettext)('Reply')}
            </button>
            <button type="button" onClick={onClickCancelReply} className="comment__button">
              {(0, gettext_1.gettext)('Cancel')}
            </button>
          </div>
        </form>);
        }
        else if (replies.length === 0) {
            // If there is no form, or replies, don't add any elements to the dom
            // This is in case there is a warning after the comment, some special styling
            // is added if that element is that last child so we can't have any hidden elements here.
            return null;
        }
        return (<>
        <ul className="comment__replies">{replies}</ul>
        {replyForm}
      </>);
    }
    renderCreating() {
        const { comment, store, isFocused } = this.props;
        const onChangeText = (value) => {
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                newText: value,
            }));
        };
        const onSave = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield saveComment(comment, store);
        });
        const onCancel = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_2.deleteComment)(comment.localId));
        };
        const descriptionId = `comment-description-${comment.localId}`;
        return (<>
        <CommentHeader_1.CommentHeader descriptionId={descriptionId} commentReply={comment} store={store} focused={isFocused}/>
        <form onSubmit={onSave}>
          <TextArea_1.default focusTarget={isFocused} className="comment__input" value={comment.newText} onChange={onChangeText} placeholder={(0, gettext_1.gettext)('Enter your comments...')} additionalAttributes={{
                'aria-describedby': descriptionId,
            }}/>
          <div className="comment__actions">
            <button disabled={comment.newText.length === 0} type="submit" className="comment__button comment__button--primary">
              {(0, gettext_1.gettext)('Comment')}
            </button>
            <button type="button" onClick={onCancel} className="comment__button">
              {(0, gettext_1.gettext)('Cancel')}
            </button>
          </div>
        </form>
      </>);
    }
    renderEditing() {
        const { comment, store, isFocused } = this.props;
        const onChangeText = (value) => {
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                newText: value,
            }));
        };
        const onSave = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield saveComment(comment, store);
        });
        const onCancel = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'default',
                newText: comment.text,
            }));
        };
        const descriptionId = `comment-description-${comment.localId}`;
        return (<>
        <CommentHeader_1.CommentHeader descriptionId={descriptionId} commentReply={comment} store={store} focused={isFocused}/>
        <form onSubmit={onSave}>
          <TextArea_1.default focusTarget={isFocused} className="comment__input" value={comment.newText} additionalAttributes={{
                'aria-describedby': descriptionId,
            }} onChange={onChangeText}/>
          <div className="comment__actions">
            <button disabled={comment.newText.length === 0} type="submit" className="comment__button comment__button--primary">
              {(0, gettext_1.gettext)('Save')}
            </button>
            <button type="button" onClick={onCancel} className="comment__button">
              {(0, gettext_1.gettext)('Cancel')}
            </button>
          </div>
        </form>
        {this.renderReplies({ hideNewReply: true })}
      </>);
    }
    renderSaving() {
        const { comment, store, isFocused } = this.props;
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        <div className="comment__progress">{(0, gettext_1.gettext)('Saving...')}</div>
        {this.renderReplies({ hideNewReply: true })}
      </>);
    }
    renderSaveError() {
        const { comment, store, isFocused } = this.props;
        const onClickRetry = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield saveComment(comment, store);
        });
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        {this.renderReplies({ hideNewReply: true })}
        <div className="comment__error">
          {(0, gettext_1.gettext)('Save error')}
          <button type="button" className="comment__button" onClick={onClickRetry}>
            {(0, gettext_1.gettext)('Retry')}
          </button>
        </div>
      </>);
    }
    renderDeleteConfirm() {
        const { comment, store, isFocused } = this.props;
        const onClickDelete = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield doDeleteComment(comment, store);
        });
        const onClickCancel = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'default',
            }));
        };
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        <div className="comment__confirm-delete">
          {(0, gettext_1.gettext)('Are you sure?')}
          <button type="button" className="comment__button button button-small" onClick={onClickCancel}>
            {(0, gettext_1.gettext)('Cancel')}
          </button>
          <button type="button" className="comment__button button button-small no" onClick={onClickDelete}>
            {(0, gettext_1.gettext)('Delete')}
          </button>
        </div>
        {this.renderReplies({ hideNewReply: true })}
      </>);
    }
    renderDeleting() {
        const { comment, store, isFocused } = this.props;
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        <div className="comment__progress">{(0, gettext_1.gettext)('Deleting')}</div>
        {this.renderReplies({ hideNewReply: true })}
      </>);
    }
    renderDeleteError() {
        const { comment, store, isFocused } = this.props;
        const onClickRetry = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield doDeleteComment(comment, store);
        });
        const onClickCancel = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            store.dispatch((0, comments_2.updateComment)(comment.localId, {
                mode: 'default',
            }));
        });
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        {this.renderReplies({ hideNewReply: true })}
        <div className="comment__error">
          {(0, gettext_1.gettext)('Delete error')}
          <button type="button" className="comment__button" onClick={onClickCancel}>
            {(0, gettext_1.gettext)('Cancel')}
          </button>
          <button type="button" className="comment__button" onClick={onClickRetry}>
            {(0, gettext_1.gettext)('Retry')}
          </button>
        </div>
      </>);
    }
    renderDefault() {
        const { comment, store, isFocused } = this.props;
        // Show edit/delete buttons if this comment was authored by the current user
        let onEdit;
        let onDelete;
        if (comment.author === null ||
            (this.props.user && this.props.user.id === comment.author.id)) {
            onEdit = () => {
                store.dispatch((0, comments_2.updateComment)(comment.localId, {
                    mode: 'editing',
                    newText: comment.text,
                }));
            };
            onDelete = () => {
                store.dispatch((0, comments_2.updateComment)(comment.localId, {
                    mode: 'delete_confirm',
                }));
            };
        }
        let notice = '';
        if (!comment.remoteId) {
            // Save the page to add this comment
            notice = (0, gettext_1.gettext)('Save the page to add this comment');
        }
        else if (comment.text !== comment.originalText) {
            // Save the page to save this comment
            notice = (0, gettext_1.gettext)('Save the page to save this comment');
        }
        return (<>
        <CommentHeader_1.CommentHeader commentReply={comment} store={store} onResolve={doResolveComment} onEdit={onEdit} onDelete={onDelete} focused={isFocused}/>
        <p className="comment__text">{comment.text}</p>
        {notice && (<div className="comment__notice-placeholder">
            <div className="comment__notice" role="status">
              <Icon_1.default name="info-circle"/>
              {notice}
            </div>
          </div>)}
        {this.renderReplies()}
      </>);
    }
    render() {
        let inner;
        switch (this.props.comment.mode) {
            case 'creating':
                inner = this.renderCreating();
                break;
            case 'editing':
                inner = this.renderEditing();
                break;
            case 'saving':
                inner = this.renderSaving();
                break;
            case 'save_error':
                inner = this.renderSaveError();
                break;
            case 'delete_confirm':
                inner = this.renderDeleteConfirm();
                break;
            case 'deleting':
                inner = this.renderDeleting();
                break;
            case 'delete_error':
                inner = this.renderDeleteError();
                break;
            default:
                inner = this.renderDefault();
                break;
        }
        const onClick = () => {
            this.props.store.dispatch((0, comments_2.setFocusedComment)(this.props.comment.localId, {
                updatePinnedComment: false,
                forceFocus: this.props.isFocused && this.props.forceFocus,
            }));
        };
        const onDoubleClick = () => {
            this.props.store.dispatch((0, comments_2.setFocusedComment)(this.props.comment.localId, {
                updatePinnedComment: true,
                forceFocus: true,
            }));
        };
        const top = this.props.layout.getCommentPosition(this.props.comment.localId);
        return (<focus_trap_react_1.default focusTrapOptions={{
                preventScroll: true,
                clickOutsideDeactivates: true,
                onDeactivate: () => {
                    this.props.store.dispatch((0, comments_2.setFocusedComment)(null, {
                        updatePinnedComment: true,
                        forceFocus: false,
                    }));
                },
                initialFocus: '[data-focus-target="true"]',
                delayFocus: false,
            }} // For some reason, the types for FocusTrap props don't yet include preventScroll.
         active={this.props.isFocused && this.props.forceFocus}>
        <li tabIndex={-1} data-focus-target={this.props.isFocused &&
                !['creating', 'editing'].includes(this.props.comment.mode)} key={this.props.comment.localId} className={`comment comment--mode-${this.props.comment.mode} ${this.props.isFocused ? 'comment--focused' : ''}`} style={{
                position: 'absolute',
                top: `${top}px`,
                display: this.props.isVisible ? 'block' : 'none',
            }} data-comment-id={this.props.comment.localId} onClick={onClick} onDoubleClick={onDoubleClick}>
          {inner}
        </li>
      </focus_trap_react_1.default>);
    }
    componentDidMount() {
        // eslint-disable-next-line react/no-find-dom-node
        const element = react_dom_1.default.findDOMNode(this);
        if (element instanceof HTMLElement) {
            this.props.layout.setCommentElement(this.props.comment.localId, element);
            if (this.props.isVisible) {
                this.props.layout.setCommentHeight(this.props.comment.localId, element.offsetHeight);
            }
        }
    }
    componentWillUnmount() {
        this.props.layout.setCommentElement(this.props.comment.localId, null);
    }
    componentDidUpdate() {
        // eslint-disable-next-line react/no-find-dom-node
        const element = react_dom_1.default.findDOMNode(this);
        // Keep height up to date so that other comments will be moved out of the way
        if (this.props.isVisible && element instanceof HTMLElement) {
            this.props.layout.setCommentHeight(this.props.comment.localId, element.offsetHeight);
        }
    }
}
exports.default = CommentComponent;
