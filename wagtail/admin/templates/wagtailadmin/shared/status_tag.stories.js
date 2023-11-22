"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const status_tag_html_1 = __importDefault(require("./status_tag.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(status_tag_html_1.default);
exports.default = {
    parameters: { docs },
    argTypes: Object.assign(Object.assign({}, argTypes), { classname: {
            options: [null, 'w-status--primary', 'w-status--label'],
        }, url: {
            options: [null, 'https://wagtail.org/'],
        }, title: {
            options: [null, 'wagtail live url'],
        }, hidden_label: {
            options: [null, 'current status:'],
        } }),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Live = Template.bind({});
exports.Live.args = {
    label: 'live',
    classname: null,
    url: null,
    title: null,
    hidden_label: null,
};
