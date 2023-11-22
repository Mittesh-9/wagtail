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
const enzyme_1 = require("enzyme");
const draft_js_1 = require("draft-js");
const MaxLength_1 = __importStar(require("./MaxLength"));
/**
 * Keep those tests up-to-date with RichTextMaxLengthValidator tests server-side.
 */
describe('MaxLength', () => {
    it('works', () => {
        const contentState = (0, draft_js_1.convertFromRaw)({
            entityMap: {},
            blocks: [{ text: 'hello' }],
        });
        const editorState = draft_js_1.EditorState.createWithContent(contentState);
        expect((0, enzyme_1.shallow)(<MaxLength_1.default getEditorState={() => editorState} onChange={() => { }} id="max-length-test" maxLength={10}/>).text()).toBe('Character count:5/10');
    });
    it('supports 0', () => {
        expect((0, enzyme_1.shallow)(<MaxLength_1.default getEditorState={() => draft_js_1.EditorState.createEmpty()} onChange={() => { }} id="max-length-test" maxLength={10}/>).text()).toBe('Character count:0/10');
    });
    it('ignores atomic blocks', () => {
        const contentState = (0, draft_js_1.convertFromRaw)({
            entityMap: {},
            blocks: [
                { text: 'hello' },
                { text: ' ', type: 'atomic' },
                { text: 'world' },
            ],
        });
        const editorState = draft_js_1.EditorState.createWithContent(contentState);
        expect((0, enzyme_1.shallow)(<MaxLength_1.default getEditorState={() => editorState} onChange={() => { }} id="max-length-test" maxLength={10}/>).text()).toBe('Character count:10/10');
    });
});
// Make sure count here matches result in TestRichTextMaxLengthValidator.test_count_characters
test.each([
    // Embed blocks should be ignored.
    [['Plain text'], 'Plain text', 10],
    // HTML entities should be un-escaped.
    [["There's quote"], "There's quote", 13],
    // BR should be ignored.
    [['Line\nbreak'], 'Linebreak', 9],
    // Content over multiple blocks should be treated as a single line of text with no joiner.
    [['Multi', 'blocks'], 'Multiblocks', 11],
    // Empty blocks should be ignored.
    [['Empty', '', 'blocks'], 'Emptyblocks', 11],
])('getPlainText', (blocks, plainText, count) => {
    const contentState = (0, draft_js_1.convertFromRaw)({
        entityMap: {},
        blocks: blocks.map((block) => ({ text: block })),
    });
    const editorState = draft_js_1.EditorState.createWithContent(contentState);
    const text = (0, MaxLength_1.getPlainText)(editorState);
    // Check the plain-text version as well to help with troubleshooting.
    expect(text).toBe(plainText);
    expect((0, MaxLength_1.countCharacters)(text)).toBe(count);
});
// Make sure count here matches result in TestRichTextMaxLengthValidator.test_count_characters
describe.each `
  text         | result | segmenterLength
  ${'123456'}  | ${6}   | ${6}
  ${'123 45'}  | ${6}   | ${6}
  ${'123\n45'} | ${6}   | ${6}
  ${'\n'}      | ${1}   | ${1}
  ${''}        | ${0}   | ${0}
  ${' '}       | ${1}   | ${1}
  ${'❤️'}      | ${2}   | ${1}
  ${'👨‍👨‍👧'}      | ${5}   | ${1}
`('countCharacters', ({ text, result, segmenterLength }) => {
    test(text, () => {
        expect((0, MaxLength_1.countCharacters)(text)).toBe(result);
        // For debugging only – show the segmenter grapheme length as a reference of the perceived length.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
        expect(Array.from(seg.segment(text))).toHaveLength(segmenterLength);
    });
});
