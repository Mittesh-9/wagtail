"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const tab_nav_link_html_1 = __importDefault(require("./tab_nav_link.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(tab_nav_link_html_1.default);
exports.default = {
    title: 'Shared / Tabs / TabsNavLink',
    parameters: { docs },
    argTypes: Object.assign({}, argTypes),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    tab_id: 'tasks',
    title: 'Tasks',
};
exports.Errors = Template.bind({});
exports.Errors.args = {
    tab_id: 'content',
    title: 'Content',
    errors_count: 35,
};
