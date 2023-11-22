"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScale = exports.FontFamilies = void 0;
const react_1 = __importDefault(require("react"));
const typography_1 = require("./typography");
const description = `
Wagtail’s type styles are structured as design tokens, available as CSS classes.
`;
exports.default = {
    title: 'Foundation / Typography',
    parameters: {
        docs: {
            extractComponentDescription: () => description,
        },
    },
};
const FontFamilies = () => (<div>
    <p>Wagtail’s UI fonts use system font stacks:</p>
    <div className="w-font-sans">
      <strong>Font sans (default)</strong>
      <pre>{typography_1.fontFamily.sans.join(', ')}</pre>
    </div>
    <div className="w-font-mono">
      <strong>Font mono</strong>
      <pre>{typography_1.fontFamily.mono.join(', ')}</pre>
    </div>
  </div>);
exports.FontFamilies = FontFamilies;
const exampleText = {
    'w-h1': 'Heading level (h1)',
    'w-h2': 'Heading level 2 (h2)',
    'w-h3': 'Heading level 3 (h3)',
    'w-h4': 'Heading level 4 (h4)',
    'w-label-1': 'Large label',
    'w-label-2': 'Medium label',
    'w-label-3': 'Small label',
    'w-body-text-large': 'Large body text',
    'w-body-text': 'Basic body text',
    'w-help-text': 'Help text',
};
const TypeScale = () => (<table>
    <caption>All text styles</caption>
    <thead>
      <tr>
        <th scope="col">Style</th>
        <th scope="col">Class</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(typography_1.typeScale).map((textStyle) => (<tr key={textStyle}>
          <td>
            <span className={`${textStyle} w-mt-4`}>
              {exampleText[textStyle] || textStyle.replace('w-', '')}
            </span>
          </td>
          <td>
            <code>{`.${textStyle}`}</code>
          </td>
        </tr>))}
    </tbody>
  </table>);
exports.TypeScale = TypeScale;
