"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutController = void 0;
const maps_1 = require("./maps");
const GAP = 20.0; // Gap between comments in pixels
const TOP_MARGIN = 100.0; // Spacing from the top to the first comment in pixels
const OFFSET = -50; // How many pixels from the annotation position should the comments be placed?
class LayoutController {
    constructor() {
        this.commentElements = new Map();
        this.commentAnnotations = new Map();
        this.commentTabs = new Map();
        this.commentDesiredPositions = new Map();
        this.commentHeights = new Map();
        this.pinnedComment = null;
        this.commentCalculatedPositions = new Map();
        this.isDirty = false;
    }
    setCommentElement(commentId, element) {
        if (element !== null) {
            this.commentElements.set(commentId, element);
        }
        else {
            this.commentElements.delete(commentId);
        }
        this.isDirty = true;
    }
    setCommentAnnotation(commentId, annotation) {
        this.commentAnnotations.set(commentId, annotation);
        this.commentTabs.set(commentId, annotation.getTab() || null);
        this.updateDesiredPosition(commentId);
        this.isDirty = true;
    }
    setCommentHeight(commentId, height) {
        if (this.commentHeights.get(commentId) !== height) {
            this.commentHeights.set(commentId, height);
            this.isDirty = true;
        }
    }
    setPinnedComment(commentId) {
        this.pinnedComment = commentId;
        this.isDirty = true;
    }
    updateDesiredPosition(commentId) {
        const annotation = this.commentAnnotations.get(commentId);
        if (!annotation) {
            return;
        }
        const currentNode = annotation.getAnchorNode(commentId === this.pinnedComment);
        let currentNodeTop = currentNode.getBoundingClientRect().top;
        // adjust currentNodeTop for scroll positions of all ancestor elements
        let parent = currentNode.parentElement;
        while (parent) {
            currentNodeTop += parent.scrollTop;
            parent = parent.parentElement;
        }
        this.commentDesiredPositions.set(commentId, currentNodeTop !== 0 ? currentNodeTop + OFFSET : 0);
    }
    refreshDesiredPositions(tab = null) {
        /* Finds the current annotation positions of all the comments on the specified tab */
        const oldDesiredPositions = new Map(this.commentDesiredPositions);
        this.commentAnnotations.forEach((_, commentId) => {
            if (this.getCommentTabVisible(tab, commentId)) {
                this.updateDesiredPosition(commentId);
            }
        });
        // It's not great to be recalculating all positions so regularly, but Wagtail's FE widgets
        // aren't very constrained so could change layout in any number of ways. If we have a stable FE
        // widget framework in the future, this could be used to trigger the position refresh more
        // intelligently, or alternatively once comments is incorporated into the page form, a
        // MutationObserver could potentially track most types of changes.
        if (this.commentDesiredPositions !== oldDesiredPositions) {
            this.isDirty = true;
        }
    }
    refreshLayout() {
        /* Updates positions of all comments based on their annotation locations, and resolves any overlapping comments */
        if (!this.isDirty) {
            return false;
        }
        // Build list of blocks (starting with one for each comment)
        const allBlocks = Array.from(this.commentElements.keys()).map((commentId) => ({
            tab: (0, maps_1.getOrDefault)(this.commentTabs, commentId, null),
            position: (0, maps_1.getOrDefault)(this.commentDesiredPositions, commentId, 0),
            height: (0, maps_1.getOrDefault)(this.commentHeights, commentId, 0),
            comments: [commentId],
            containsPinnedComment: this.pinnedComment !== null && commentId === this.pinnedComment,
            pinnedCommentPosition: 0,
        }));
        // Group blocks by tabs
        const blocksByTab = new Map();
        allBlocks.forEach((block) => {
            const blocks = blocksByTab.get(block.tab) || [];
            blocks.push(block);
            blocksByTab.set(block.tab, blocks);
        });
        // Get location of pinned comment
        const pinnedCommentPosition = this.pinnedComment
            ? this.commentDesiredPositions.get(this.pinnedComment)
            : undefined;
        const pinnedCommentTab = this.pinnedComment
            ? this.commentTabs.get(this.pinnedComment)
            : undefined;
        // For each tab, resolve positions of all the comments
        Array.from(blocksByTab.entries()).forEach(([tab, blocks]) => {
            const pinnedCommentOnThisTab = this.pinnedComment && pinnedCommentTab === tab;
            // Sort blocks
            blocks.sort((block, comparisonBlock) => block.position - comparisonBlock.position);
            // Resolve overlapping blocks
            let currentBlocks = blocks;
            let overlaps = true;
            while (overlaps) {
                overlaps = false;
                const newBlocks = [];
                let previousBlock = null;
                for (const block of currentBlocks) {
                    if (previousBlock) {
                        if (previousBlock.position + previousBlock.height + GAP >
                            block.position) {
                            overlaps = true;
                            // Merge the blocks
                            previousBlock.comments.push(...block.comments);
                            if (block.containsPinnedComment) {
                                previousBlock.containsPinnedComment = true;
                                previousBlock.pinnedCommentPosition =
                                    block.pinnedCommentPosition + previousBlock.height;
                            }
                            previousBlock.height += block.height;
                            // Make sure comments don't disappear off the top of the page
                            // But only if a comment isn't focused
                            if (!pinnedCommentOnThisTab &&
                                previousBlock.position < TOP_MARGIN + OFFSET) {
                                previousBlock.position =
                                    TOP_MARGIN + previousBlock.height - OFFSET;
                            }
                            // If this block contains the focused comment, position it so
                            // the focused comment is in it's desired position
                            if (pinnedCommentPosition &&
                                previousBlock.containsPinnedComment) {
                                previousBlock.position =
                                    pinnedCommentPosition - previousBlock.pinnedCommentPosition;
                            }
                            // eslint-disable-next-line no-continue
                            continue;
                        }
                    }
                    newBlocks.push(block);
                    previousBlock = block;
                }
                currentBlocks = newBlocks;
            }
            // Write positions
            currentBlocks.forEach((block) => {
                let currentPosition = block.position;
                block.comments.forEach((commentId) => {
                    this.commentCalculatedPositions.set(commentId, currentPosition);
                    const height = this.commentHeights.get(commentId);
                    if (height) {
                        currentPosition += height + GAP;
                    }
                });
            });
        });
        this.isDirty = false;
        return true;
    }
    getCommentTabVisible(tab, commentId) {
        const commentTab = (0, maps_1.getOrDefault)(this.commentTabs, commentId, null);
        return commentTab === tab;
    }
    getCommentVisible(tab, commentId) {
        return (this.getCommentTabVisible(tab, commentId) &&
            (0, maps_1.getOrDefault)(this.commentDesiredPositions, commentId, 1) > 0);
    }
    getCommentPosition(commentId) {
        if (this.commentCalculatedPositions.has(commentId)) {
            return this.commentCalculatedPositions.get(commentId);
        }
        return this.commentDesiredPositions.get(commentId);
    }
}
exports.LayoutController = LayoutController;
