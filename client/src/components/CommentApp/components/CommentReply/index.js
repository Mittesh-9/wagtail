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
exports.saveCommentReply = void 0;
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../../../utils/gettext");
const comments_1 = require("../../actions/comments");
const CommentHeader_1 = require("../CommentHeader");
const TextArea_1 = __importDefault(require("../TextArea"));
const Icon_1 = __importDefault(require("../../../Icon/Icon"));
function saveCommentReply(comment, reply, store) {
    return __awaiter(this, void 0, void 0, function* () {
        store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
            mode: 'saving',
        }));
        try {
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'default',
                text: reply.newText,
                author: reply.author,
            }));
        }
        catch (err) {
            /* eslint-disable-next-line no-console */
            console.error(err);
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'save_error',
            }));
        }
    });
}
exports.saveCommentReply = saveCommentReply;
function deleteCommentReply(comment, reply, store) {
    return __awaiter(this, void 0, void 0, function* () {
        store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
            mode: 'deleting',
        }));
        try {
            store.dispatch((0, comments_1.deleteReply)(comment.localId, reply.localId));
        }
        catch (err) {
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'delete_error',
            }));
        }
    });
}
class CommentReplyComponent extends react_1.default.Component {
    renderEditing() {
        const { comment, reply, store, isFocused } = this.props;
        const onChangeText = (value) => {
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                newText: value,
            }));
        };
        const onSave = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield saveCommentReply(comment, reply, store);
        });
        const onCancel = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'default',
                newText: reply.text,
            }));
        };
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <form onSubmit={onSave}>
          <TextArea_1.default className="comment-reply__input" value={reply.newText} onChange={onChangeText}/>
          <div className="comment-reply__actions">
            <button type="submit" disabled={reply.newText.length === 0} className="comment-reply__button comment-reply__button--primary">
              {(0, gettext_1.gettext)('Save')}
            </button>
            <button type="button" className="comment-reply__button" onClick={onCancel}>
              {(0, gettext_1.gettext)('Cancel')}
            </button>
          </div>
        </form>
      </>);
    }
    renderSaving() {
        const { reply, store, isFocused } = this.props;
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        <div className="comment-reply__progress">{(0, gettext_1.gettext)('Saving...')}</div>
      </>);
    }
    renderSaveError() {
        const { comment, reply, store, isFocused } = this.props;
        const onClickRetry = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield saveCommentReply(comment, reply, store);
        });
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        <div className="comment-reply__error">
          {(0, gettext_1.gettext)('Save error')}
          <button type="button" className="comment-reply__button" onClick={onClickRetry}>
            {(0, gettext_1.gettext)('Retry')}
          </button>
        </div>
      </>);
    }
    renderDeleteConfirm() {
        const { comment, reply, store, isFocused } = this.props;
        const onClickDelete = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield deleteCommentReply(comment, reply, store);
        });
        const onClickCancel = (e) => {
            e.preventDefault();
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'default',
            }));
        };
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        <div className="comment-reply__confirm-delete">
          {(0, gettext_1.gettext)('Are you sure?')}
          <button type="button" className="comment-reply__button" onClick={onClickCancel}>
            {(0, gettext_1.gettext)('Cancel')}
          </button>
          <button type="button" className="comment-reply__button comment-reply__button--primary" onClick={onClickDelete}>
            {(0, gettext_1.gettext)('Delete')}
          </button>
        </div>
      </>);
    }
    renderDeleting() {
        const { reply, store, isFocused } = this.props;
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        <div className="comment-reply__progress">{(0, gettext_1.gettext)('Deleting')}</div>
      </>);
    }
    renderDeleteError() {
        const { comment, reply, store, isFocused } = this.props;
        const onClickRetry = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield deleteCommentReply(comment, reply, store);
        });
        const onClickCancel = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                mode: 'default',
            }));
        });
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        <div className="comment-reply__error">
          {(0, gettext_1.gettext)('Delete error')}
          <button type="button" className="comment-reply__button" onClick={onClickCancel}>
            {(0, gettext_1.gettext)('Cancel')}
          </button>
          <button type="button" className="comment-reply__button" onClick={onClickRetry}>
            {(0, gettext_1.gettext)('Retry')}
          </button>
        </div>
      </>);
    }
    renderDefault() {
        const { comment, reply, store, isFocused } = this.props;
        // Show edit/delete buttons if this reply was authored by the current user
        let onEdit;
        let onDelete;
        if (reply.author === null ||
            (this.props.user && this.props.user.id === reply.author.id)) {
            onEdit = () => {
                store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                    mode: 'editing',
                    newText: reply.text,
                }));
            };
            onDelete = () => {
                store.dispatch((0, comments_1.updateReply)(comment.localId, reply.localId, {
                    mode: 'delete_confirm',
                }));
            };
        }
        let notice = '';
        if (!reply.remoteId || reply.text !== reply.originalText) {
            // Save the page to save this reply
            notice = (0, gettext_1.gettext)('Save the page to save this reply');
        }
        return (<>
        <CommentHeader_1.CommentHeader commentReply={reply} store={store} onEdit={onEdit} onDelete={onDelete} focused={isFocused}/>
        <p className="comment-reply__text">{reply.text}</p>
        {notice && (<div className="comment__notice-placeholder">
            <div className="comment__notice" role="status">
              <Icon_1.default name="info-circle"/>
              {notice}
            </div>
          </div>)}
      </>);
    }
    render() {
        let inner;
        switch (this.props.reply.mode) {
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
        return (<li key={this.props.reply.localId} className={`comment-reply comment-reply--mode-${this.props.reply.mode}`} data-reply-id={this.props.reply.localId}>
        {inner}
      </li>);
    }
}
exports.default = CommentReplyComponent;
