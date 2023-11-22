"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expanded = exports.WithNonLinkItem = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const StimulusWrapper_1 = require("../../../../../client/storybook/StimulusWrapper");
const RevealController_1 = require("../../../../../client/src/controllers/RevealController");
const breadcrumbs_html_1 = __importDefault(require("./breadcrumbs.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(breadcrumbs_html_1.default);
exports.default = {
    parameters: { docs },
    argTypes: Object.assign({}, argTypes),
};
const Template = (args) => (<StimulusWrapper_1.StimulusWrapper definitions={[
        { identifier: 'w-breadcrumbs', controllerConstructor: RevealController_1.RevealController },
    ]}>
    <header>
      <react_2.Pattern filename={__filename} context={args}/>
    </header>
  </StimulusWrapper_1.StimulusWrapper>);
exports.Base = Template.bind({});
exports.Base.args = {
    items: [
        {
            url: '/admin/snippets/',
            label: 'Snippets',
        },
        {
            url: '/admin/snippets/people/',
            label: 'People',
        },
        {
            url: '/admin/snippets/people/1/',
            label: 'Muddy Waters',
        },
    ],
};
exports.WithNonLinkItem = Template.bind({});
exports.WithNonLinkItem.args = {
    items: [
        {
            url: '/admin/snippets/',
            label: 'Snippets',
        },
        {
            url: '/admin/snippets/people/',
            label: 'People',
        },
        {
            label: 'New: Person',
        },
    ],
};
exports.Expanded = Template.bind({});
exports.Expanded.args = {
    is_expanded: 'True',
    items: [
        {
            url: '/admin/snippets/',
            label: 'Snippets',
        },
        {
            url: '/admin/snippets/people/',
            label: 'People',
        },
        {
            url: '/admin/snippets/people/1/',
            label: 'Muddy Waters',
        },
    ],
};
