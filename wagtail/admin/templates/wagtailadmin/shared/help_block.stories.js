"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const help_block_html_1 = __importDefault(require("./help_block.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(help_block_html_1.default);
exports.default = {
    parameters: { docs },
    argTypes: Object.assign({}, argTypes),
};
const HelpBlock = (props) => <react_2.Pattern filename={__filename} context={props}/>;
const Base = () => (<>
    <HelpBlock status="info">Help block info message</HelpBlock>
    <HelpBlock status="warning">Help block warning message</HelpBlock>
    <HelpBlock status="critical">Help block critical message</HelpBlock>
  </>);
exports.Base = Base;
