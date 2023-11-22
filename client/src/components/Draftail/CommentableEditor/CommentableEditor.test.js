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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const enzyme_1 = require("enzyme");
const draftail_1 = require("draftail");
const draft_js_1 = require("draft-js");
const main_1 = require("../../CommentApp/main");
const comments_1 = require("../../CommentApp/state/comments");
const noop_1 = require("../../../utils/noop");
const CommentableEditor_1 = __importStar(require("./CommentableEditor"));
describe('CommentableEditor', () => {
    const content = {
        entityMap: {},
        blocks: [
            {
                key: 'a',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                text: 'test',
                entityRanges: [],
            },
        ],
    };
    const contentWithComment = {
        entityMap: {},
        blocks: [
            {
                key: 'a',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 1,
                        style: 'COMMENT-1',
                    },
                ],
                text: 'test',
                entityRanges: [],
            },
        ],
    };
    const contentWithOverlappingComments = {
        entityMap: {},
        blocks: [
            {
                key: 'a',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 10,
                        style: 'COMMENT-2',
                    },
                    {
                        offset: 0,
                        length: 20,
                        style: 'COMMENT-1',
                    },
                ],
                text: 'test_test_test_test_test_test_test',
                entityRanges: [],
            },
        ],
    };
    const contentWithMultipleComments = {
        entityMap: {},
        blocks: [
            {
                key: 'a',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 21,
                        length: 4,
                        style: 'COMMENT-2',
                    },
                    {
                        offset: 0,
                        length: 20,
                        style: 'COMMENT-1',
                    },
                ],
                text: 'test_test_test_test_test_test_test',
                entityRanges: [],
            },
        ],
    };
    let commentApp;
    let fieldNode;
    let getEditorComponent;
    const contentpath = 'test-contentpath';
    const getComments = (app) => app.utils.selectCommentsForContentPathFactory(contentpath)(app.store.getState());
    beforeAll(() => {
        const commentsElement = document.createElement('div');
        document.body.appendChild(commentsElement);
        const commentsOutputElement = document.createElement('div');
        document.body.appendChild(commentsOutputElement);
        fieldNode = document.createElement('div');
        document.body.appendChild(fieldNode);
        getEditorComponent = (app) => (<react_redux_1.Provider store={app.store}>
        <CommentableEditor_1.default commentApp={app} fieldNode={fieldNode} contentPath={contentpath} rawContentState={content} onSave={noop_1.noop} inlineStyles={[]} editorRef={noop_1.noop} isCommentShortcut={() => false}/>
      </react_redux_1.Provider>);
    });
    beforeEach(() => {
        commentApp = new main_1.CommentApp();
    });
    it('has control', () => {
        const editor = (0, enzyme_1.mount)(getEditorComponent(commentApp));
        const controls = editor.find('DraftailEditor').prop('controls');
        expect(controls).toHaveLength(1);
        expect(controls[0].inline).toBeTruthy();
        editor.unmount();
    });
    it('can update comment positions', () => {
        var _a, _b, _c;
        commentApp.store.dispatch(commentApp.actions.addComment((0, comments_1.newComment)('test-contentpath', 'old_position', 1, null, null, 0, {})));
        // Test that a comment with no annotation will not have its position updated
        (0, CommentableEditor_1.updateCommentPositions)({
            editorState: (0, draftail_1.createEditorStateFromRaw)(content),
            comments: getComments(commentApp),
            commentApp: commentApp,
        });
        expect((_a = commentApp.store.getState().comments.comments.get(1)) === null || _a === void 0 ? void 0 : _a.position).toBe('old_position');
        commentApp.updateAnnotation(new CommentableEditor_1.DraftailInlineAnnotation(fieldNode), 1);
        // Test that a comment with no style in the ContentState will have an empty position set
        (0, CommentableEditor_1.updateCommentPositions)({
            editorState: (0, draftail_1.createEditorStateFromRaw)(content),
            comments: getComments(commentApp),
            commentApp: commentApp,
        });
        expect((_b = commentApp.store.getState().comments.comments.get(1)) === null || _b === void 0 ? void 0 : _b.position).toBe('[]');
        // Test that a comment with a style range has that style range recorded accurately in the state
        (0, CommentableEditor_1.updateCommentPositions)({
            editorState: (0, draftail_1.createEditorStateFromRaw)(contentWithComment),
            comments: getComments(commentApp),
            commentApp: commentApp,
        });
        expect((_c = commentApp.store.getState().comments.comments.get(1)) === null || _c === void 0 ? void 0 : _c.position).toBe('[{"key":"a","start":0,"end":1}]');
    });
    it('can add comments to editor', () => {
        var _a;
        commentApp.store.dispatch(commentApp.actions.addComment((0, comments_1.newComment)(contentpath, '[{"key":"a","start":0,"end":1}]', 1, null, null, 0, {})));
        // Test that comment styles are correctly added to the editor,
        // and the comments in the state have annotations assigned
        const newContentState = (0, CommentableEditor_1.addCommentsToEditor)((0, draftail_1.createEditorStateFromRaw)(content).getCurrentContent(), getComments(commentApp), commentApp, () => new CommentableEditor_1.DraftailInlineAnnotation(fieldNode));
        newContentState.getFirstBlock().findStyleRanges((metadata) => !metadata.getStyle().isEmpty(), (start, end) => {
            expect(newContentState
                .getFirstBlock()
                .getInlineStyleAt(start)
                .has('COMMENT-1')).toBe(true);
            expect(start).toBe(0);
            expect(end).toBe(1);
        });
        expect((_a = commentApp.store.getState().comments.comments.get(1)) === null || _a === void 0 ? void 0 : _a.annotation).not.toBe(null);
    });
    it('can find the least common comment id', () => {
        const block = (0, draftail_1.createEditorStateFromRaw)(contentWithOverlappingComments)
            .getCurrentContent()
            .getFirstBlock();
        // In the overlapping range, comment 2 covers the least, so should be found
        expect((0, CommentableEditor_1.findLeastCommonCommentId)(block, 0)).toBe(2);
        // In the non overlapping range, only comment 1 exists, so should be found
        expect((0, CommentableEditor_1.findLeastCommonCommentId)(block, 11)).toBe(1);
    });
    it('can split its state and identify comments to move', () => {
        const state = draft_js_1.EditorState.acceptSelection((0, draftail_1.createEditorStateFromRaw)(contentWithMultipleComments), new draft_js_1.SelectionState({
            anchorKey: 'a',
            anchorOffset: 21,
            focusKey: 'a',
            focusOffset: 21,
        }));
        const { stateBefore, stateAfter, shouldMoveCommentFn } = (0, CommentableEditor_1.splitState)(state);
        expect(stateBefore.getCurrentContent().getFirstBlock().getText()).toBe('test_test_test_test_t');
        expect(stateAfter.getCurrentContent().getFirstBlock().getText()).toBe('est_test_test');
        expect(shouldMoveCommentFn((0, comments_1.newComment)('test-contentpath', '[{"key":"a","start":0,"end":20}]', 1, null, null, 0, {}))).toBe(false);
        expect(shouldMoveCommentFn((0, comments_1.newComment)('test-contentpath', '[{"key":"a","start":21,"end":25}]', 2, null, null, 0, {}))).toBe(true);
    });
    it('does not lose highlighted text when splitting', () => {
        const state = draft_js_1.EditorState.acceptSelection((0, draftail_1.createEditorStateFromRaw)(contentWithOverlappingComments), new draft_js_1.SelectionState({
            anchorKey: 'a',
            anchorOffset: 21,
            focusKey: 'a',
            focusOffset: 26,
        }));
        const { stateBefore, stateAfter } = (0, CommentableEditor_1.splitState)(state);
        expect(stateBefore.getCurrentContent().getFirstBlock().getText()).toBe('test_test_test_test_t');
        expect(stateAfter.getCurrentContent().getFirstBlock().getText()).toBe('est_test_test');
    });
    it('creates a valid EditorState when splitting at start', () => {
        const state = draft_js_1.EditorState.acceptSelection((0, draftail_1.createEditorStateFromRaw)(contentWithOverlappingComments), new draft_js_1.SelectionState({
            anchorKey: 'a',
            anchorOffset: 0,
            focusKey: 'a',
            focusOffset: 26,
        }));
        const { stateBefore, stateAfter } = (0, CommentableEditor_1.splitState)(state);
        const editor = (0, enzyme_1.mount)(getEditorComponent(commentApp));
        const getDraftail = () => editor.findWhere((n) => n.name() === 'DraftailEditor');
        getDraftail().invoke('onChange')(stateBefore);
        expect(getDraftail().prop('editorState').getCurrentContent().getPlainText()).toEqual(stateBefore.getCurrentContent().getPlainText());
        getDraftail().invoke('onChange')(stateAfter);
        expect(getDraftail().prop('editorState').getCurrentContent().getPlainText()).toEqual(stateAfter.getCurrentContent().getPlainText());
        editor.unmount();
    });
});
