"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTestReply = exports.addTestComment = exports.RenderCommentsForStorybook = void 0;
const react_1 = __importDefault(require("react"));
const comments_1 = require("../actions/comments");
const comments_2 = require("../state/comments");
const layout_1 = require("./layout");
const sequences_1 = require("./sequences");
const index_1 = __importDefault(require("../components/Comment/index"));
function RenderCommentsForStorybook({ store, author, }) {
    const [state, setState] = react_1.default.useState(store.getState());
    store.subscribe(() => {
        setState(store.getState());
    });
    const layout = new layout_1.LayoutController();
    const commentsToRender = Array.from(state.comments.comments.values());
    const commentsRendered = commentsToRender.map((comment) => (<index_1.default key={comment.localId} store={store} layout={layout} user={author || {
            id: 1,
            name: 'Admin',
            avatarUrl: 'https://gravatar.com/avatar/e31ec811942afbf7b9ce0ac5affe426f?s=200&d=robohash&r=x',
        }} comment={comment} isVisible={true} isFocused={comment.localId === state.comments.focusedComment}/>));
    return <ol className="comments-list">{commentsRendered}</ol>;
}
exports.RenderCommentsForStorybook = RenderCommentsForStorybook;
function addTestComment(store, options) {
    const commentId = (0, sequences_1.getNextCommentId)();
    const addCommentOptions = options;
    const author = options.author || {
        id: 1,
        name: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/e31ec811942afbf7b9ce0ac5affe426f?s=200&d=robohash&r=x',
    };
    // We must have a remoteId unless the comment is being created
    if (options.mode !== 'creating' && options.remoteId === undefined) {
        addCommentOptions.remoteId = commentId;
    }
    // Comment must be focused if the mode is anything other than default
    if (options.mode !== 'default' && options.focused === undefined) {
        addCommentOptions.focused = true;
    }
    store.dispatch((0, comments_1.addComment)((0, comments_2.newComment)('test', '', commentId, null, author, Date.now(), addCommentOptions)));
    if (options.focused) {
        store.dispatch((0, comments_1.setFocusedComment)(commentId, { updatePinnedComment: true }));
    }
    return commentId;
}
exports.addTestComment = addTestComment;
function addTestReply(store, commentId, options) {
    const addReplyOptions = options;
    const author = options.author || {
        id: 1,
        name: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/e31ec811942afbf7b9ce0ac5affe426f?s=200&d=robohash&r=x',
    };
    if (!options.remoteId) {
        addReplyOptions.remoteId = 1;
    }
    store.dispatch((0, comments_1.addReply)(commentId, (0, comments_2.newCommentReply)(1, author, Date.now(), addReplyOptions)));
}
exports.addTestReply = addTestReply;
