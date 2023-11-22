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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommentApp = exports.CommentApp = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const redux_1 = require("redux");
const layout_1 = require("./utils/layout");
const maps_1 = require("./utils/maps");
const sequences_1 = require("./utils/sequences");
const state_1 = require("./state");
const comments_1 = require("./state/comments");
const comments_2 = require("./actions/comments");
const settings_1 = require("./actions/settings");
const selectors_1 = require("./selectors");
const Comment_1 = __importDefault(require("./components/Comment"));
const Form_1 = require("./components/Form");
const settings_2 = require("./state/settings");
/* eslint-enable */
const getAuthor = (authors, id) => {
    const authorData = (0, maps_1.getOrDefault)(authors, String(id), {
        name: '',
        avatar_url: '',
    });
    return {
        id,
        name: authorData.name,
        avatarUrl: authorData.avatar_url,
    };
};
function CommentListing({ store, layout, comments, }) {
    const state = store.getState();
    const { user, currentTab } = state.settings;
    const { focusedComment, forceFocus } = state.comments;
    const commentsListRef = react_1.default.useRef(null);
    // Update the position of the comments listing as the window scrolls to keep the comments in line with the content
    const updateScroll = (0, react_1.useCallback)((e) => {
        if (!commentsListRef.current) {
            return;
        }
        if (e.type === 'scroll' &&
            !document.querySelector('.form-side--comments')) {
            return;
        }
        const scrollContainer = document.querySelector('.content');
        const top = scrollContainer === null || scrollContainer === void 0 ? void 0 : scrollContainer.getBoundingClientRect().top;
        commentsListRef.current.style.top = `${top}px`;
    }, [commentsListRef]);
    let commentsToRender = comments;
    react_1.default.useEffect(() => {
        const root = document.querySelector('#main');
        const commentSidePanel = document.querySelector('[data-side-panel="comments"]');
        root === null || root === void 0 ? void 0 : root.addEventListener('scroll', updateScroll);
        commentSidePanel === null || commentSidePanel === void 0 ? void 0 : commentSidePanel.addEventListener('show', updateScroll);
        return () => {
            root === null || root === void 0 ? void 0 : root.removeEventListener('scroll', updateScroll);
            commentSidePanel === null || commentSidePanel === void 0 ? void 0 : commentSidePanel.removeEventListener('show', updateScroll);
        };
    }, []);
    if (!user) {
        commentsToRender = [];
    }
    // Hide all resolved/deleted comments
    commentsToRender = commentsToRender.filter(({ deleted, resolved }) => !(deleted || resolved));
    const commentsRendered = commentsToRender.map((comment) => (<Comment_1.default key={comment.localId} store={store} layout={layout} user={user} comment={comment} isFocused={comment.localId === focusedComment} forceFocus={forceFocus} isVisible={layout.getCommentVisible(currentTab, comment.localId)}/>));
    return (<ol ref={commentsListRef} className="comments-list">
      {commentsRendered}
    </ol>);
    /* eslint-enable react/no-danger */
}
class CommentApp {
    constructor() {
        this.utils = {
            selectCommentsForContentPathFactory: selectors_1.selectCommentsForContentPathFactory,
            selectCommentFactory: selectors_1.selectCommentFactory,
        };
        this.selectors = {
            selectComments: selectors_1.selectComments,
            selectFocused: selectors_1.selectFocused,
            selectIsDirty: selectors_1.selectIsDirty,
            selectCommentCount: selectors_1.selectCommentCount,
        };
        this.actions = comments_2.commentActionFunctions;
        this.activationHandlers = [];
        this.store = (0, redux_1.createStore)(state_1.reducer, {
            settings: settings_2.INITIAL_STATE,
        });
        this.layout = new layout_1.LayoutController();
    }
    setUser(userId, authors) {
        this.store.dispatch((0, settings_1.updateGlobalSettings)({
            user: getAuthor(authors, userId),
        }));
    }
    updateAnnotation(annotation, commentId) {
        this.attachAnnotationLayout(annotation, commentId);
        this.store.dispatch((0, comments_2.updateComment)(commentId, { annotation: annotation }));
    }
    attachAnnotationLayout(annotation, commentId) {
        // Attach an annotation to an existing comment in the layout
        // const layout engine know the annotation so it would position the comment correctly
        this.layout.setCommentAnnotation(commentId, annotation);
    }
    setCurrentTab(tab) {
        this.store.dispatch((0, settings_1.updateGlobalSettings)({ currentTab: tab }));
    }
    makeComment(annotation, contentpath, position = '') {
        const commentId = (0, sequences_1.getNextCommentId)();
        this.attachAnnotationLayout(annotation, commentId);
        // Create the comment
        this.store.dispatch((0, comments_2.addComment)((0, comments_1.newComment)(contentpath, position, commentId, annotation, this.store.getState().settings.user, Date.now(), {
            mode: 'creating',
        })));
        // Focus and pin the comment
        this.store.dispatch((0, comments_2.setFocusedComment)(commentId, {
            updatePinnedComment: true,
            forceFocus: true,
        }));
        return commentId;
    }
    activate() {
        this.activationHandlers.forEach((handler) => handler());
    }
    onActivate(handler) {
        this.activationHandlers.push(handler);
    }
    invalidateContentPath(contentPath) {
        // Called when a given content path on the form is no longer valid (eg, a block has been deleted)
        this.store.dispatch((0, comments_2.invalidateContentPath)(contentPath));
    }
    updateContentPath(commentId, newContentPath) {
        this.store.dispatch((0, comments_2.updateComment)(commentId, { contentpath: newContentPath }));
    }
    renderApp(element, outputElement, userId, initialComments, authors) {
        let pinnedComment = null;
        this.setUser(userId, authors);
        // Check if there is "comment" query parameter.
        // If this is set, the user has clicked on a "View on frontend" link of an
        // individual comment. We should focus this comment and scroll to it
        const urlParams = new URLSearchParams(window.location.search);
        let initialFocusedCommentId = null;
        const commentParams = urlParams.get('comment');
        if (commentParams) {
            initialFocusedCommentId = parseInt(commentParams, 10);
        }
        const render = () => {
            const state = this.store.getState();
            const commentList = Array.from(state.comments.comments.values());
            react_dom_1.default.render(<Form_1.CommentFormSetComponent comments={commentList.filter((comment) => comment.mode !== 'creating')} remoteCommentCount={state.comments.remoteCommentCount}/>, outputElement);
            // Check if the pinned comment has changed
            if (state.comments.pinnedComment !== pinnedComment) {
                // Tell layout controller about the pinned comment
                // so it is moved alongside its annotation
                this.layout.setPinnedComment(state.comments.pinnedComment);
                pinnedComment = state.comments.pinnedComment;
            }
            react_dom_1.default.render(<CommentListing store={this.store} layout={this.layout} comments={commentList}/>, element, () => {
                // Render again if layout has changed (eg, a comment was added, deleted or resized)
                // This will just update the "top" style attributes in the comments to get them to move
                this.layout.refreshDesiredPositions(state.settings.currentTab);
                if (this.layout.refreshLayout()) {
                    react_dom_1.default.render(<CommentListing store={this.store} layout={this.layout} comments={commentList}/>, element);
                }
            });
        };
        // Fetch existing comments
        for (const comment of initialComments) {
            const commentId = (0, sequences_1.getNextCommentId)();
            // Create comment
            this.store.dispatch((0, comments_2.addComment)((0, comments_1.newComment)(comment.contentpath, comment.position, commentId, null, getAuthor(authors, comment.user), Date.parse(comment.created_at), {
                remoteId: comment.pk,
                text: comment.text,
                deleted: comment.deleted,
                resolved: comment.resolved,
            })));
            // Create replies
            for (const reply of comment.replies) {
                this.store.dispatch((0, comments_2.addReply)(commentId, (0, comments_1.newCommentReply)((0, sequences_1.getNextReplyId)(), getAuthor(authors, reply.user), Date.parse(reply.created_at), {
                    remoteId: reply.pk,
                    text: reply.text,
                    deleted: reply.deleted,
                })));
            }
            // If this is the initial focused comment. Focus and pin it
            // TODO: Scroll to this comment
            if (initialFocusedCommentId && comment.pk === initialFocusedCommentId) {
                this.store.dispatch((0, comments_2.setFocusedComment)(commentId, {
                    updatePinnedComment: true,
                    forceFocus: true,
                }));
            }
        }
        render();
        this.store.subscribe(render);
        // Unfocus when document body is clicked
        document.body.addEventListener('mousedown', (e) => {
            if (e.target instanceof HTMLElement) {
                // ignore if click target is a comment or an annotation
                if (!e.target.closest('#comments, [data-annotation], [data-comment-add]')) {
                    // Running store.dispatch directly here seems to prevent the event from being handled anywhere else
                    setTimeout(() => {
                        this.store.dispatch((0, comments_2.setFocusedComment)(null, {
                            updatePinnedComment: true,
                            forceFocus: false,
                        }));
                    }, 200);
                }
            }
        });
        document.body.addEventListener('commentAnchorVisibilityChange', () => {
            // If any streamfield blocks or panels have collapsed or expanded
            // check if we need to rerender
            this.layout.refreshDesiredPositions(this.store.getState().settings.currentTab);
            if (this.layout.refreshLayout()) {
                render();
            }
        });
    }
}
exports.CommentApp = CommentApp;
function initCommentApp() {
    return new CommentApp();
}
exports.initCommentApp = initCommentApp;
