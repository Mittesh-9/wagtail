"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlainText = exports.countCharacters = void 0;
const react_1 = __importDefault(require("react"));
const draftail_1 = require("draftail");
const gettext_1 = require("../../../utils/gettext");
/**
 * Count characters in a string, with special processing to account for astral symbols in UCS-2,
 * matching the behaviour of HTML-native maxlength. See:
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://github.com/RadLikeWhoa/Countable/blob/master/Countable.js#L29
 */
const countCharacters = (text) => {
    if (text) {
        // Flags: return all matches (g), matching newlines as characters (s), as unicode code points (u).
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags.
        const matches = text.match(/./gsu);
        return matches ? matches.length : 0;
    }
    return 0;
};
exports.countCharacters = countCharacters;
/**
 * Retrieves the plain text content of the editor similarly of how we would server-side,
 * ignoring inline formatting, atomic blocks, and discarding line breaks.
 */
const getPlainText = (editorState) => {
    const content = editorState.getCurrentContent();
    const text = content.getBlockMap().reduce((acc, item) => {
        const block = item;
        const isAtomicBlock = block.getType() === draftail_1.BLOCK_TYPE.ATOMIC;
        return `${acc}${isAtomicBlock ? '' : block.getText()}`;
    }, '');
    return text.replace(/\n/g, '');
};
exports.getPlainText = getPlainText;
/**
 * Shows the editor’s character count, with a calculation of unicode characters
 * matching that of `maxlength` attributes.
 */
const MaxLength = ({ getEditorState, maxLength, id }) => {
    const text = (0, exports.getPlainText)(getEditorState());
    return (<div className="w-inline-block w-tabular-nums w-help-text" id={id}>
      <span className="w-sr-only">{(0, gettext_1.gettext)('Character count:')}</span>
      <span>{`${(0, exports.countCharacters)(text)}/${maxLength}`}</span>
    </div>);
};
exports.default = MaxLength;
