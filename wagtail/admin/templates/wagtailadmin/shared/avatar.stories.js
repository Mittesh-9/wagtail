"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Square = exports.Large = exports.Small = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const avatar_html_1 = __importDefault(require("./avatar.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(avatar_html_1.default);
exports.default = {
    parameters: {
        docs,
    },
    argTypes: Object.assign(Object.assign({}, argTypes), { size: {
            options: [null, 'small', 'large', 'square'],
        } }),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    size: 'null',
};
exports.Small = Template.bind({});
exports.Small.args = {
    size: 'small',
};
exports.Large = Template.bind({});
exports.Large.args = {
    size: 'large',
};
exports.Square = Template.bind({});
exports.Square.args = {
    size: 'square',
};
