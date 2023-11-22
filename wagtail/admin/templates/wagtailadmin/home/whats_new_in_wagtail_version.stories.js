"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const whats_new_in_wagtail_version_html_1 = __importDefault(require("./whats_new_in_wagtail_version.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(whats_new_in_wagtail_version_html_1.default);
exports.default = {
    title: 'Home / New in Wagtail',
    parameters: { docs },
    argTypes: Object.assign({}, argTypes),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    version: '99',
    dismissible_id: 'aabbcc',
    editor_guide_link: 'https://guide.wagtail.org/',
};
