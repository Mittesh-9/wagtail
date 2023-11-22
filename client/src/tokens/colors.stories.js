"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorCustomisations = exports.ColorThemes = exports.ColorPalette = void 0;
const react_1 = __importDefault(require("react"));
const colors_1 = require("./colors");
const colorThemes_1 = __importDefault(require("./colorThemes"));
const colorVariables_1 = require("./colorVariables");
const description = `
Wagtail’s typographic styles are made available as separate design tokens, but in most scenarios it’s better to use one of the predefined text styles.
`;
/**
 * Generates a contrast grid URL from our color palette.
 */
const getContrastGridLink = () => {
    const url = 'https://contrast-grid.eightshapes.com/';
    const parameters = '?version=1.1.0&es-color-form__tile-size=compact&es-color-form__show-contrast=aaa&es-color-form__show-contrast=aa&es-color-form__show-contrast=aa18';
    const bg = [];
    const fg = [];
    Object.values(colors_1.staticColors).forEach((hues) => {
        Object.values(hues).forEach((shade) => {
            const color = `${shade.hex}, ${shade.textUtility.replace('w-text-', '')}`;
            bg.push(color);
            if (!shade.usage.toLowerCase().includes('background only')) {
                fg.push(color);
            }
        });
    });
    return `${url}${parameters}&background-colors=${encodeURIComponent(bg.join('\r\n'))}&foreground-colors=${encodeURIComponent(fg.join('\r\n'))}`;
};
const Palette = ({ color, hues }) => (<div className="w-mb-4 w-mr-4 w-flex w-flex-row">
    {Object.entries(hues).map(([name, shade]) => (<div key={name}>
        <h3 className="w-h3">{`${color} ${name === 'DEFAULT' ? '' : name}`}</h3>
        <div className={`w-p-3 w-pr-0 w-flex w-flex-col w-w-52 w-h-52 ${shade.bgUtility} ${color === 'white' ? 'w-border w-border-solid w-border-grey-520' : ''} w-text-14 w-text-${shade.contrastText}`}>
          <code>{shade.textUtility}</code>
          <code>{shade.bgUtility}</code>
          <code>{shade.cssVariable}</code>
          <code>{shade.hsl}</code>
          <code>{shade.hex}</code>
        </div>
        <p className="mt-3 w-w-52">{shade.usage}</p>
      </div>))}
  </div>);
exports.default = {
    title: 'Foundation / Colors',
    parameters: {
        docs: {
            extractComponentDescription: () => description,
        },
    },
};
const ColorPalette = () => (<>
    <p>
      View <a href={getContrastGridLink()}>Contrast Grid</a>. Here is our full
      color palette, with contrasting text chosen for readability of this
      example only.
    </p>
    {Object.entries(colors_1.staticColors).map(([color, hues]) => (<div key={color}>
        <h2 className="w-sr-only">{color}</h2>
        <Palette color={color} hues={hues}/>
      </div>))}
  </>);
exports.ColorPalette = ColorPalette;
const TokenSwatch = ({ name, token }) => (<div className="w-shadow w-border w-border-border-furniture w-rounded w-w-36 w-p-2.5">
    <div className={`w-w-12 w-h-10 w-rounded ${token.bgUtility}${token.value.includes('white') || token.value.includes('grey-600')
        ? ' w-border w-border-border-furniture'
        : ''}`}/>
    <h4 className="w-label-3">{name}</h4>
    <p className="w-help-text">
      {token.value.replace('var(--w-color-', '').replace(')', '')}
    </p>
  </div>);
const CategorySwatches = ({ category }) => (<div key={category.label}>
    <h3 className="w-h3">{category.label}</h3>
    <div className="w-grid w-grid-flow-col w-gap-2.5">
      {Object.entries(category.tokens).map(([name, token]) => (<TokenSwatch key={token} name={name} token={token}/>))}
    </div>
  </div>);
const ColorThemes = () => (<>
    <section className="w-bg-surface-page w-pt-6 w-mt-6 -w-mx-4 w-px-4">
      <h2 className="w-h2">Light</h2>
      {colorThemes_1.default.light.map((category) => (<CategorySwatches key={category.label} category={category}/>))}
    </section>
    <section className="w-bg-surface-page w-pt-6 w-mt-6 -w-mx-4 w-px-4 w-theme-dark">
      <h2 className="w-h2">Dark</h2>
      {colorThemes_1.default.dark.map((category) => (<CategorySwatches key={category.label} category={category}/>))}
    </section>
  </>);
exports.ColorThemes = ColorThemes;
const rootVariablesMap = [
    ...Object.entries((0, colorVariables_1.generateColorVariables)(colors_1.staticColors)),
    ...Object.entries((0, colorVariables_1.generateThemeColorVariables)(colorThemes_1.default.light)),
]
    .map(([cssVar, val]) => `${cssVar}: ${val};`)
    .join('');
const darkVariablesMap = Object.entries((0, colorVariables_1.generateThemeColorVariables)(colorThemes_1.default.dark))
    .map(([cssVar, val]) => `${cssVar}: ${val};`)
    .join('');
const secondaryHSL = colors_1.staticColors.secondary.DEFAULT.hsl.match(/\d+(\.\d+)?/g);
// Make sure this contains no empty lines, otherwise Sphinx docs will treat this as paragraphs.
const liveEditorCustomisations = `:root {
  --w-color-primary: ${colors_1.staticColors.primary.DEFAULT.hex};
  /* Any valid CSS format is supported. */
  --w-color-primary-200: ${colors_1.staticColors.primary[200].hsl};
  /* Set each HSL component separately to change all hues at once. */
  --w-color-secondary-hue: ${secondaryHSL[0]};
  --w-color-secondary-saturation: ${secondaryHSL[1]}%;
  --w-color-secondary-lightness: ${secondaryHSL[2]}%;
}`;
// Story using inline styles only so it can be copy-pasted into the Wagtail documentation for color customisations.
const demoStyles = `
  :root {${rootVariablesMap}}
  .w-theme-dark {${darkVariablesMap}}
  .wagtail-color-swatch {
    border-collapse: separate;
    border-spacing: 4px;
  }

  .wagtail-color-swatch td:first-child,
  .wagtail-color-swatch .w-theme-dark {
    height: 1.5rem;
    width: 1.5rem;
    border: 1px solid #333;
    forced-color-adjust: none;
  }
`;
const warningComment = '<!-- Auto-generated with Storybook. See https://github.com/wagtail/wagtail/blob/main/client/src/tokens/colors.stories.tsx. Copy this comment’s parent section to update the `custom_user_interface_colours` documentation. -->';
const colorCustomisationsDemo = (<section>
    <div 
// eslint-disable-next-line react/no-danger
dangerouslySetInnerHTML={{
        __html: warningComment,
    }}/>
    <p>
      Make sure to test any customisations against our{' '}
      <a href={getContrastGridLink()}>Contrast Grid</a>. Try out your own
      customisations with this interactive style editor:
    </p>
    {/* Required styles are in a separate tag so they can’t be overridden, compressed to a single line for ease of copy-pasting. */}
    <style>{demoStyles.replace(/\s+/gm, ' ')}</style>
    <pre>
      {/* contentEditable style element so it can be edited directly in the browser. */}
      <style contentEditable suppressContentEditableWarning={true} style={{ display: 'block' }}>
        {liveEditorCustomisations}
      </style>
    </pre>
    <h3>Static colours</h3>
    <table className="wagtail-color-swatch">
      <thead>
        <tr>
          <th aria-label="Swatch"/>
          <th>Variable</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(colors_1.staticColors).map((hues) => Object.entries(hues)
        //  Show DEFAULT shades first, then in numerical order.
        .sort(([nameA], [nameB]) => nameA === 'DEFAULT' ? -1 : Number(nameB) - Number(nameA))
        .map(([name, shade]) => (<tr key={shade.hex}>
                <td style={{ backgroundColor: `var(${shade.cssVariable})` }}/>
                <td>
                  <code>{shade.cssVariable}</code>
                </td>
                <td>{shade.usage}</td>
              </tr>)))}
      </tbody>
    </table>
    <h3>Light & dark theme colours</h3>
    <table className="wagtail-color-swatch">
      <thead>
        <tr>
          <th>Light</th>
          <th>Dark</th>
          <th>Variable</th>
        </tr>
      </thead>
      {colorThemes_1.default.light.map((category) => (<tbody key={category.label}>
          <tr>
            <th scope="rowgroup" colSpan={3}>
              {category.label}
            </th>
          </tr>
          {Object.values(category.tokens).map((token) => (<tr key={token.cssVariable}>
              <td style={{ backgroundColor: `var(${token.cssVariable})` }}/>
              <td className="w-theme-dark" style={{ backgroundColor: `var(${token.cssVariable})` }}/>
              <td>
                <code>{token.cssVariable}</code>
              </td>
            </tr>))}
        </tbody>))}
    </table>
  </section>);
const ColorCustomisations = () => (<>
    <p>
      Use this story to test customising colors. The section below is also
      copied in the Wagtail docs so implementers know which colors are
      customisable in a given release.
    </p>
    <hr />
    {colorCustomisationsDemo}
  </>);
exports.ColorCustomisations = ColorCustomisations;
