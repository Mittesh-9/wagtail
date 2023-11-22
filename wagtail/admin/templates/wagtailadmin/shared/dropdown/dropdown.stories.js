"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const StimulusWrapper_1 = require("../../../../../../client/storybook/StimulusWrapper");
const DropdownController_1 = require("../../../../../../client/src/controllers/DropdownController");
const dropdown_html_1 = __importDefault(require("./dropdown.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(dropdown_html_1.default);
exports.default = {
    parameters: {
        docs,
    },
    argTypes: Object.assign(Object.assign({}, argTypes), { toggle_icon: {
            control: 'select',
            options: [null, ...window.WAGTAIL_ICONS],
        } }),
    decorators: [
        (Story) => (<StimulusWrapper_1.StimulusWrapper debug definitions={[
                {
                    identifier: 'w-dropdown',
                    controllerConstructor: DropdownController_1.DropdownController,
                },
            ]}>
        <Story />
      </StimulusWrapper_1.StimulusWrapper>),
    ],
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    toggle_icon: 'dots-horizontal',
    toggle_aria_label: 'Actions',
    children: `
  <a href="">Link</a>
  <a href=""><svg class="icon icon-arrows-up-down" aria-hidden="true"><use href="#icon-arrows-up-down"></use></svg>Link with icon</a>
  <button type="button">Button</button>
  <button type="button"><svg class="icon icon-arrows-up-down" aria-hidden="true"><use href="#icon-arrows-up-down"></use></svg>Button with icon</button>
`,
};
