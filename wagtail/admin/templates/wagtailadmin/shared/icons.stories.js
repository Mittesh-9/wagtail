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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllIcons = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("storybook-django/src/react");
const description = `
Wagtail comes with a base icon set, which can be extended by site implementers.

Here is a list of all available icons, auto-generated from our SVG sprite.
`;
/**
 * Displays all icons within our sprite.
 */
const IconsTable = ({ color }) => {
    const [template, setTemplate] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        (0, react_2.getTemplatePattern)('wagtailadmin/shared/icon.html', { name: '__icon__' }, {}, (html) => setTemplate(html));
    }, []);
    return (<table>
      <caption>All registered icons</caption>
      <thead>
        <tr>
          <th scope="col">Visual</th>
          <th scope="col">Name</th>
          <th scope="col">Usage</th>
        </tr>
      </thead>
      {window.WAGTAIL_ICONS.map((icon) => (<tr key={icon}>
          <td 
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
                __html: template
                    .replace(/__icon__/g, icon)
                    .replace(/<svg/, `<svg style="fill: ${color};"`),
            }}/>
          <td>
            <code>{icon}</code>
          </td>
          <td>
            <code>{`{% icon name="${icon}" %}`}</code>
          </td>
        </tr>))}
    </table>);
};
exports.default = {
    title: 'Foundation / Icons',
    parameters: {
        docs: {
            extractComponentDescription: () => description,
        },
    },
    argTypes: {
        color: {
            description: 'Only intended for demo purposes',
        },
    },
};
const AllIcons = (args) => <IconsTable {...args}/>;
exports.AllIcons = AllIcons;
exports.AllIcons.args = {
    color: 'currentColor',
};
