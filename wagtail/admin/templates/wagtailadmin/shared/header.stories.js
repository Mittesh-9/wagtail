"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const header_html_1 = __importDefault(require("./header.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(header_html_1.default);
exports.default = {
    parameters: {
        docs,
    },
    argTypes: Object.assign(Object.assign({}, argTypes), { icon: {
            options: window.WAGTAIL_ICONS,
            control: { type: 'select' },
            description: 'name of an icon to place against the title',
        } }),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    title: 'Calendar',
    icon: 'date',
};
exports.Action = Template.bind({});
exports.Action.args = {
    title: 'Users',
    subtitle: 'Editors',
    icon: 'user',
    action_url: '/test/',
    action_text: 'Add',
};
