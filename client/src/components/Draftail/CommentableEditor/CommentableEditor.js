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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentsToEditor = exports.findLeastCommonCommentId = exports.updateCommentPositions = exports.splitState = exports.DraftailInlineAnnotation = void 0;
const draftail_1 = require("draftail");
const draft_js_1 = require("draft-js");
const draftjs_filters_1 = require("draftjs-filters");
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const gettext_1 = require("../../../utils/gettext");
const Icon_1 = __importDefault(require("../../Icon/Icon"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DraftEditorLeaf = require('draft-js/lib/DraftEditorLeaf.react');
const { isOptionKeyCommand } = draft_js_1.KeyBindingUtil;
const COMMENT_STYLE_IDENTIFIER = 'COMMENT-';
// Hack taken from https://github.com/springload/draftail/blob/main/lib/api/behavior.js#L30
// Can be replaced with usesMacOSHeuristics once we upgrade draft-js
const IS_MAC_OS = isOptionKeyCommand({ altKey: true }) === true;
function usePrevious(value) {
    const ref = (0, react_1.useRef)(value);
    (0, react_1.useEffect)(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
/**
 * Controls the positioning of a comment that has been added to Draftail.
 * `getAnchorNode` is called by the comments app to determine which node
 * to float the comment alongside
 */
class DraftailInlineAnnotation {
    constructor(field) {
        this.field = field;
        this.decoratorRefs = new Map();
        this.focusedBlockKey = '';
        this.cachedMedianRef = null;
    }
    addDecoratorRef(ref, blockKey) {
        this.decoratorRefs.set(ref, blockKey);
        // We're adding a ref, so remove the cached median refs - this needs to be recalculated
        this.cachedMedianRef = null;
    }
    removeDecoratorRef(ref) {
        this.decoratorRefs.delete(ref);
        // We're deleting a ref, so remove the cached median refs - this needs to be recalculated
        this.cachedMedianRef = null;
    }
    setFocusedBlockKey(blockKey) {
        this.focusedBlockKey = blockKey;
    }
    static getHeightForRef(ref) {
        if (ref.current) {
            return ref.current.getBoundingClientRect().top;
        }
        return 0;
    }
    static getMedianRef(refArray) {
        const refs = refArray.sort((firstRef, secondRef) => this.getHeightForRef(firstRef) - this.getHeightForRef(secondRef));
        const length = refs.length;
        if (length > 0) {
            return refs[Math.ceil(length / 2 - 1)];
        }
        return null;
    }
    getTab() {
        var _a;
        return (_a = this.field.closest('[role="tabpanel"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('id');
    }
    getAnchorNode(focused = false) {
        // The comment should always aim to float by an annotation, rather than between them
        // so calculate which annotation is the median one by height and float the comment by that
        let medianRef = null;
        if (focused) {
            // If the comment is focused, calculate the median of refs only
            // within the focused block, to ensure the comment is visible
            // if the highlight has somehow been split up
            medianRef = DraftailInlineAnnotation.getMedianRef(Array.from(this.decoratorRefs.keys()).filter((ref) => this.decoratorRefs.get(ref) === this.focusedBlockKey));
        }
        else if (!this.cachedMedianRef) {
            // Our cache is empty - try to update it
            medianRef = DraftailInlineAnnotation.getMedianRef(Array.from(this.decoratorRefs.keys()));
            this.cachedMedianRef = medianRef;
        }
        else {
            // Use the cached median refs
            medianRef = this.cachedMedianRef;
        }
        // Fallback to the field node, if the comment has no decorator refs
        return (medianRef === null || medianRef === void 0 ? void 0 : medianRef.current) || this.field;
    }
}
exports.DraftailInlineAnnotation = DraftailInlineAnnotation;
function applyInlineStyleToRange({ contentState, style, blockKey, start, end, }) {
    return draft_js_1.Modifier.applyInlineStyle(contentState, new draft_js_1.SelectionState({
        anchorKey: blockKey,
        anchorOffset: start,
        focusKey: blockKey,
        focusOffset: end,
    }), style);
}
/**
 * Get a selection state corresponding to the full contentState.
 */
function getFullSelectionState(contentState) {
    const lastBlock = contentState.getLastBlock();
    return new draft_js_1.SelectionState({
        anchorKey: contentState.getFirstBlock().getKey(),
        anchorOffset: 0,
        focusKey: lastBlock.getKey(),
        focusOffset: lastBlock.getLength(),
    });
}
function addNewComment(editorState, fieldNode, commentApp, contentPath) {
    let state = editorState;
    const annotation = new DraftailInlineAnnotation(fieldNode);
    const commentId = commentApp.makeComment(annotation, contentPath, '[]');
    const selection = editorState.getSelection();
    // If the selection is collapsed, add the comment highlight on the whole field
    state = draft_js_1.EditorState.acceptSelection(editorState, selection.isCollapsed()
        ? getFullSelectionState(editorState.getCurrentContent())
        : selection);
    return draft_js_1.EditorState.acceptSelection(draft_js_1.RichUtils.toggleInlineStyle(state, `${COMMENT_STYLE_IDENTIFIER}${commentId}`), selection);
}
function styleIsComment(style) {
    return style !== undefined && style.startsWith(COMMENT_STYLE_IDENTIFIER);
}
function getIdForCommentStyle(style) {
    return parseInt(style.slice(COMMENT_STYLE_IDENTIFIER.length), 10);
}
function getCommentPositions(editorState) {
    // Construct a map of comment id -> array of style ranges
    const commentPositions = new Map();
    editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .forEach((block) => {
        const key = block.getKey();
        block.findStyleRanges((metadata) => metadata.getStyle().some(styleIsComment), (start, end) => {
            block
                .getInlineStyleAt(start)
                .filter(styleIsComment)
                .forEach((style) => {
                // We have already filtered out any undefined styles, so cast here
                const id = getIdForCommentStyle(style);
                let existingPosition = commentPositions.get(id);
                if (!existingPosition) {
                    existingPosition = [];
                }
                existingPosition.push({
                    key: key,
                    start: start,
                    end: end,
                });
                commentPositions.set(id, existingPosition);
            });
        });
    });
    return commentPositions;
}
function createFromBlockArrayOrPlaceholder(blockArray) {
    // This is needed due to (similar) https://github.com/facebook/draft-js/issues/1660
    // Causing empty block arrays in an editorState to crash the editor
    // It is fixed in later versions of draft-js (~11.3?), but this upgrade needs
    // more evaluation for impact on Draftail/Commenting/other Wagtail usages
    // TODO: upgrade Draft.js
    if (blockArray.length > 0) {
        return draft_js_1.ContentState.createFromBlockArray(blockArray);
    }
    return draft_js_1.ContentState.createFromText(' ');
}
function splitState(editorState) {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    // In order to use Modifier.splitBlock, we need a collapsed selection
    // otherwise we will lose highlighted text
    const collapsedSelection = selection.isCollapsed()
        ? selection
        : new draft_js_1.SelectionState({
            anchorKey: selection.getStartKey(),
            anchorOffset: selection.getStartOffset(),
            focusKey: selection.getStartKey(),
            focusOffset: selection.getStartOffset(),
        });
    const multipleBlockContent = draft_js_1.Modifier.splitBlock(currentContent, collapsedSelection).getBlocksAsArray();
    const index = multipleBlockContent.findIndex((block) => block.getKey() === anchorKey);
    const blocksBefore = multipleBlockContent.slice(0, index + 1);
    const blocksAfter = multipleBlockContent.slice(index + 1);
    const stateBefore = draft_js_1.EditorState.push(editorState, createFromBlockArrayOrPlaceholder(blocksBefore), 'remove-range');
    const stateAfter = draft_js_1.EditorState.push(editorState, createFromBlockArrayOrPlaceholder(blocksAfter), 'remove-range');
    const commentIdsToMove = new Set(getCommentPositions(stateAfter).keys());
    return {
        stateBefore,
        stateAfter,
        shouldMoveCommentFn: (comment) => commentIdsToMove.has(comment.localId),
    };
}
exports.splitState = splitState;
function getCommentControl(commentApp, contentPath, fieldNode) {
    return ({ getEditorState, onChange }) => (<span className="Draftail-CommentControl" data-comment-add>
      <draftail_1.ToolbarButton name="comment" active={false} title={`${(0, gettext_1.gettext)('Add a comment')}\n${IS_MAC_OS ? '⌘ + Alt + M' : 'Ctrl + Alt + M'}`} icon={<>
            <Icon_1.default name="comment-add"/>
            <Icon_1.default name="comment-add-reversed"/>
          </>} onClick={() => {
            // Open the comments side panel
            commentApp.activate();
            onChange(addNewComment(getEditorState(), fieldNode, commentApp, contentPath));
        }}/>
    </span>);
}
function findCommentStyleRanges(contentBlock, callback, filterFn) {
    // Find comment style ranges that do not overlap an existing entity
    const filterFunction = filterFn ||
        ((metadata) => metadata.getStyle().some(styleIsComment));
    const entityRanges = [];
    contentBlock.findEntityRanges((character) => character.getEntity() !== null, (start, end) => entityRanges.push([start, end]));
    contentBlock.findStyleRanges(filterFunction, (start, end) => {
        const interferingEntityRanges = entityRanges
            .filter((value) => value[1] > start)
            .filter((value) => value[0] < end);
        let currentPosition = start;
        interferingEntityRanges.forEach((value) => {
            const [entityStart, entityEnd] = value;
            if (entityStart > currentPosition) {
                callback(currentPosition, entityStart);
            }
            currentPosition = entityEnd;
        });
        if (currentPosition < end) {
            callback(start, end);
        }
    });
}
function updateCommentPositions({ editorState, comments, commentApp, }) {
    const commentPositions = getCommentPositions(editorState);
    comments
        .filter((comment) => comment.annotation)
        .forEach((comment) => {
        // if a comment has an annotation - ie the field has it inserted - update its position
        const newPosition = commentPositions.get(comment.localId);
        const serializedNewPosition = newPosition
            ? JSON.stringify(newPosition)
            : '[]';
        if (comment.position !== serializedNewPosition) {
            commentApp.store.dispatch(commentApp.actions.updateComment(comment.localId, {
                position: serializedNewPosition,
            }));
        }
    });
}
exports.updateCommentPositions = updateCommentPositions;
/**
 * Given a contentBlock and offset within it, find the id of the comment at that offset which
 * has the fewest style ranges within the block, or null if no comment exists at the offset
 */
function findLeastCommonCommentId(block, offset) {
    const styles = block
        .getInlineStyleAt(offset)
        .filter(styleIsComment);
    let styleToUse;
    const styleCount = styles.count();
    if (styleCount === 0) {
        return null;
    }
    if (styleCount > 1) {
        // We're dealing with overlapping comments.
        // Find the least frequently occurring style and use that - this isn't foolproof, but in
        // most cases should ensure that all comments have at least one clickable section. This
        // logic is a bit heavier than ideal for a decorator given how often we are forced to
        // redecorate, but will only be used on overlapping comments
        // Use of casting in this function is due to issue #1563 in immutable-js, which causes operations like
        // map and filter to lose type information on the results. It should be fixed in v4: when we upgrade,
        // this casting should be removed
        let styleFreq = styles.map((style) => {
            let counter = 0;
            findCommentStyleRanges(block, () => {
                counter += 1;
            }, (metadata) => metadata.getStyle().some((rangeStyle) => rangeStyle === style));
            return [style, counter];
        });
        styleFreq = styleFreq.sort((firstStyleCount, secondStyleCount) => firstStyleCount[1] - secondStyleCount[1]);
        styleToUse = styleFreq.first()[0];
    }
    else {
        styleToUse = styles.first();
    }
    return getIdForCommentStyle(styleToUse);
}
exports.findLeastCommonCommentId = findLeastCommonCommentId;
function getCommentDecorator(commentApp) {
    const CommentDecorator = ({ contentState, children }) => {
        // The comment decorator makes a comment clickable, allowing it to be focused.
        // It does not provide styling, as draft-js imposes a 1 decorator/string limit,
        // which would prevent comment highlights going over links/other entities
        if (!children) {
            return null;
        }
        const blockKey = children[0].props.block.getKey();
        const start = children[0].props.start;
        const commentId = (0, react_1.useMemo)(() => {
            const block = contentState.getBlockForKey(blockKey);
            return findLeastCommonCommentId(block, start);
        }, [blockKey, start]);
        const annotationNode = (0, react_1.useRef)(null);
        (0, react_1.useEffect)(() => {
            // Add a ref to the annotation, allowing the comment to float alongside the attached text.
            // This adds rather than sets the ref, so that a comment may be attached across paragraphs or around entities
            if (!commentId) {
                return undefined;
            }
            const annotation = commentApp.layout.commentAnnotations.get(commentId);
            if (annotation && annotation instanceof DraftailInlineAnnotation) {
                annotation.addDecoratorRef(annotationNode, blockKey);
                return () => annotation.removeDecoratorRef(annotationNode);
            }
            return undefined; // eslint demands an explicit return here
        }, [commentId, annotationNode, blockKey]);
        const onClick = () => {
            // Ensure the comment will appear alongside the current block
            if (!commentId) {
                return;
            }
            const annotation = commentApp.layout.commentAnnotations.get(commentId);
            if (annotation &&
                annotation instanceof DraftailInlineAnnotation &&
                annotationNode) {
                annotation.setFocusedBlockKey(blockKey);
            }
            // Pin and focus the clicked comment
            commentApp.store.dispatch(commentApp.actions.setFocusedComment(commentId, {
                updatePinnedComment: true,
                forceFocus: false,
            }));
        };
        return (<span role="button" ref={annotationNode} onClick={onClick} aria-label={(0, gettext_1.gettext)('Focus comment')} data-annotation>
        {children}
      </span>);
    };
    return CommentDecorator;
}
function forceResetEditorState(editorState, replacementContent) {
    const content = replacementContent || editorState.getCurrentContent();
    const state = draft_js_1.EditorState.set(draft_js_1.EditorState.createWithContent(content, editorState.getDecorator()), {
        selection: editorState.getSelection(),
        undoStack: editorState.getUndoStack(),
        redoStack: editorState.getRedoStack(),
        inlineStyleOverride: editorState.getInlineStyleOverride(),
    });
    return draft_js_1.EditorState.acceptSelection(state, state.getSelection());
}
function addCommentsToEditor(contentState, comments, commentApp, getAnnotation) {
    let newContentState = contentState;
    comments
        .filter((comment) => !comment.annotation)
        .forEach((comment) => {
        commentApp.updateAnnotation(getAnnotation(), comment.localId);
        const style = `${COMMENT_STYLE_IDENTIFIER}${comment.localId}`;
        try {
            const positions = JSON.parse(comment.position);
            positions.forEach((position) => {
                newContentState = applyInlineStyleToRange({
                    contentState: newContentState,
                    blockKey: position.key,
                    start: position.start,
                    end: position.end,
                    style,
                });
            });
        }
        catch (err) {
            /* eslint-disable no-console */
            console.error(`Error loading comment position for comment ${comment.localId}`);
            console.error(err);
            /* esline-enable no-console */
        }
    });
    return newContentState;
}
exports.addCommentsToEditor = addCommentsToEditor;
function handleArrowAtContentEnd(state, setEditorState, direction) {
    // If at the end of content and pressing in the same direction as the text, remove the comment style from
    // further typing
    const newState = state;
    const selection = newState.getSelection();
    const lastBlock = newState.getCurrentContent().getLastBlock();
    const textDirection = newState.getDirectionMap().get(lastBlock.getKey());
    if (!(textDirection === direction &&
        selection.isCollapsed() &&
        selection.getAnchorKey() === lastBlock.getKey() &&
        selection.getAnchorOffset() === lastBlock.getLength())) {
        return;
    }
    setEditorState(draft_js_1.EditorState.setInlineStyleOverride(newState, newState
        .getCurrentInlineStyle()
        .filter((style) => !styleIsComment(style))));
}
function CommentableEditor(_a) {
    var { commentApp, fieldNode, contentPath, rawContentState, onSave, inlineStyles, editorRef, isCommentShortcut, plugins = [], controls = [] } = _a, options = __rest(_a, ["commentApp", "fieldNode", "contentPath", "rawContentState", "onSave", "inlineStyles", "editorRef", "isCommentShortcut", "plugins", "controls"]);
    const [editorState, setEditorState] = (0, react_1.useState)(() => (0, draftail_1.createEditorStateFromRaw)(rawContentState));
    const CommentControl = (0, react_1.useMemo)(() => getCommentControl(commentApp, contentPath, fieldNode), [commentApp, contentPath, fieldNode]);
    const commentsSelector = (0, react_1.useMemo)(() => commentApp.utils.selectCommentsForContentPathFactory(contentPath), [contentPath, commentApp]);
    const CommentDecorator = (0, react_1.useMemo)(() => getCommentDecorator(commentApp), [commentApp]);
    const comments = (0, react_redux_1.useSelector)(commentsSelector, react_redux_1.shallowEqual);
    const focusedId = (0, react_redux_1.useSelector)(commentApp.selectors.selectFocused);
    const ids = (0, react_1.useMemo)(() => comments.map((comment) => comment.localId), [comments]);
    const commentStyles = (0, react_1.useMemo)(() => ids.map((id) => ({
        type: `${COMMENT_STYLE_IDENTIFIER}${id}`,
    })), [ids]);
    const [uniqueStyleId, setUniqueStyleId] = (0, react_1.useState)(0);
    const previousFocused = usePrevious(focusedId);
    const previousIds = usePrevious(ids);
    (0, react_1.useEffect)(() => {
        // Only trigger a focus-related rerender if the current focused comment is inside the field, or the previous one was
        const validFocusChange = previousFocused !== focusedId &&
            ((previousFocused &&
                previousIds &&
                previousIds.includes(previousFocused)) ||
                (focusedId && ids.includes(focusedId)));
        if (!validFocusChange &&
            (previousIds === ids ||
                (previousIds.length === ids.length &&
                    previousIds.every((value, index) => value === ids[index])))) {
            return;
        }
        // Filter out any invalid styles - deleted comments, or now unneeded STYLE_RERENDER forcing styles
        const filteredContent = (0, draftjs_filters_1.filterInlineStyles)(inlineStyles
            .map((style) => style.type)
            .concat(ids.map((id) => `${COMMENT_STYLE_IDENTIFIER}${id}`)), editorState.getCurrentContent());
        // Force reset the editor state to ensure redecoration, and apply a new (blank) inline style to force
        // inline style rerender. This must be entirely new for the rerender to trigger, hence the unique
        // style id, as with the undo stack we cannot guarantee that a previous style won't persist without
        // filtering everywhere, which seems a bit too heavyweight.
        // This hack can be removed when draft-js triggers inline style rerender on props change
        setEditorState((state) => forceResetEditorState(state, draft_js_1.Modifier.applyInlineStyle(filteredContent, getFullSelectionState(filteredContent), `STYLE_RERENDER_${uniqueStyleId}`)));
        setUniqueStyleId((id) => (id + 1) % 200);
    }, [focusedId, inlineStyles, ids, editorState]);
    (0, react_1.useEffect)(() => {
        // if there are any comments without annotations, we need to add them to the EditorState
        const contentState = editorState.getCurrentContent();
        const newContentState = addCommentsToEditor(contentState, comments, commentApp, () => new DraftailInlineAnnotation(fieldNode));
        if (contentState !== newContentState) {
            setEditorState(forceResetEditorState(editorState, newContentState));
        }
    }, [comments]);
    const timeoutRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        // This replicates the onSave logic in Draftail, but only saves the state with all
        // comment styles filtered out
        window.clearTimeout(timeoutRef.current);
        const filteredEditorState = draft_js_1.EditorState.push(editorState, (0, draftjs_filters_1.filterInlineStyles)(inlineStyles.map((style) => style.type), editorState.getCurrentContent()), 'change-inline-style');
        timeoutRef.current = window.setTimeout(() => {
            onSave((0, draftail_1.serialiseEditorStateToRaw)(filteredEditorState));
            // Next, update comment positions in the redux store
            updateCommentPositions({ editorState, comments, commentApp });
        }, 250);
        return () => {
            window.clearTimeout(timeoutRef.current);
        };
    }, [editorState, inlineStyles]);
    return (<draftail_1.DraftailEditor ref={editorRef} onChange={(state) => {
            let newEditorState = state;
            if (['undo', 'redo'].includes(state.getLastChangeType())) {
                const filteredContent = (0, draftjs_filters_1.filterInlineStyles)(inlineStyles
                    .map((style) => style.type)
                    .concat(ids.map((id) => `${COMMENT_STYLE_IDENTIFIER}${id}`)), state.getCurrentContent());
                newEditorState = forceResetEditorState(state, filteredContent);
            }
            else if (state.getLastChangeType() === 'split-block') {
                const content = newEditorState.getCurrentContent();
                const selection = newEditorState.getSelection();
                const style = content
                    .getBlockForKey(selection.getAnchorKey())
                    .getInlineStyleAt(selection.getAnchorOffset());
                // If starting a new paragraph (and not splitting an existing comment)
                // ensure any new text entered doesn't get a comment style
                if (!style.some((styleName) => styleIsComment(styleName))) {
                    newEditorState = draft_js_1.EditorState.setInlineStyleOverride(newEditorState, newEditorState
                        .getCurrentInlineStyle()
                        .filter((styleName) => !styleIsComment(styleName)));
                }
            }
            setEditorState(newEditorState);
        }} editorState={editorState} controls={controls.concat([{ inline: CommentControl }])} inlineStyles={inlineStyles.concat(commentStyles)} plugins={plugins.concat([
            {
                decorators: [
                    {
                        strategy: (block, callback) => findCommentStyleRanges(block, callback),
                        component: CommentDecorator,
                    },
                ],
                keyBindingFn: (e) => {
                    if (isCommentShortcut(e)) {
                        return 'comment';
                    }
                    return undefined;
                },
                onRightArrow: (_, { getEditorState }) => {
                    // In later versions of draft-js, this is deprecated and can be handled via handleKeyCommand instead
                    // when draftail upgrades, this logic can be moved there
                    handleArrowAtContentEnd(getEditorState(), setEditorState, 'LTR');
                },
                onLeftArrow: (_, { getEditorState }) => {
                    // In later versions of draft-js, this is deprecated and can be handled via handleKeyCommand instead
                    // when draftail upgrades, this logic can be moved there
                    handleArrowAtContentEnd(getEditorState(), setEditorState, 'RTL');
                },
                handleKeyCommand: (command, state) => {
                    if (command === 'comment') {
                        // Open the comments side panel
                        commentApp.activate();
                        const selection = state.getSelection();
                        const content = state.getCurrentContent();
                        if (selection.isCollapsed()) {
                            // We might be trying to focus an existing comment - check if we're in a comment range
                            const id = findLeastCommonCommentId(content.getBlockForKey(selection.getAnchorKey()), selection.getAnchorOffset());
                            if (id) {
                                // Focus the comment
                                commentApp.store.dispatch(commentApp.actions.setFocusedComment(id, {
                                    updatePinnedComment: true,
                                    forceFocus: true,
                                }));
                                return 'handled';
                            }
                        }
                        // Otherwise, add a new comment
                        setEditorState(addNewComment(state, fieldNode, commentApp, contentPath));
                        return 'handled';
                    }
                    return 'not-handled';
                },
                customStyleFn: (styleSet) => {
                    // Use of casting in this function is due to issue #1563 in immutable-js, which causes operations like
                    // map and filter to lose type information on the results. It should be fixed in v4: when we upgrade,
                    // this casting should be removed
                    const localCommentStyles = styleSet.filter(styleIsComment);
                    const numStyles = localCommentStyles.count();
                    if (numStyles > 0) {
                        // There is at least one comment in the range
                        const commentIds = localCommentStyles.map((style) => getIdForCommentStyle(style));
                        const isFocused = focusedId && commentIds.has(focusedId);
                        return {
                            backgroundColor: 'var(--w-color-text-highlight)',
                            outline: isFocused
                                ? '4px solid var(--w-color-text-highlight)'
                                : null,
                        };
                    }
                    return undefined;
                },
            },
        ])} {...options}/>);
}
exports.default = CommentableEditor;
