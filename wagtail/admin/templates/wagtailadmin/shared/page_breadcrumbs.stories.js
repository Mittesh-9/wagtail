"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expanded = exports.MultipleItems = exports.WithTrailingTitle = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const StimulusWrapper_1 = require("../../../../../client/storybook/StimulusWrapper");
const RevealController_1 = require("../../../../../client/src/controllers/RevealController");
const page_breadcrumbs_html_1 = __importDefault(require("./page_breadcrumbs.html"));
const { docs, argTypes } = (0, react_2.generateDocs)(page_breadcrumbs_html_1.default);
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
    url_root_name: 'wagtailadmin_explore_root',
    url_name: 'wagtailadmin_explore',
    items: [
        {
            is_root: true,
            id: 2,
            get_admin_display_title: 'Root item',
        },
        {
            id: 3,
            get_admin_display_title: 'First item',
        },
    ],
};
exports.WithTrailingTitle = Template.bind({});
exports.WithTrailingTitle.args = {
    url_root_name: 'wagtailadmin_explore_root',
    url_name: 'wagtailadmin_explore',
    items: [
        {
            is_root: true,
            id: 2,
            get_admin_display_title: 'Root item',
        },
        {
            id: 3,
            get_admin_display_title: 'First item',
        },
        {
            id: 4,
            get_admin_display_title: 'Second item',
        },
        {
            id: 5,
            get_admin_display_title: 'Third item',
        },
    ],
    trailing_breadcrumb_title: 'Trailing item',
};
exports.MultipleItems = Template.bind({});
exports.MultipleItems.args = {
    url_root_name: 'wagtailadmin_explore_root',
    url_name: 'wagtailadmin_explore',
    items: [
        {
            is_root: true,
            id: 2,
            get_admin_display_title: 'Root item',
        },
        {
            id: 3,
            get_admin_display_title: 'First item',
        },
        {
            id: 4,
            get_admin_display_title: 'Second item',
        },
        {
            id: 5,
            get_admin_display_title: 'Third item',
        },
        {
            id: 4,
            get_admin_display_title: 'Fourth item',
        },
        {
            id: 5,
            get_admin_display_title: 'Fifth item',
        },
    ],
};
exports.Expanded = Template.bind({});
exports.Expanded.args = {
    url_root_name: 'wagtailadmin_explore_root',
    url_name: 'wagtailadmin_explore',
    is_expanded: 'True',
    items: [
        {
            is_root: true,
            id: 2,
            get_admin_display_title: 'Root item',
        },
        {
            id: 3,
            get_admin_display_title: 'First item',
        },
        {
            id: 4,
            get_admin_display_title: 'Second item',
        },
        {
            id: 5,
            get_admin_display_title: 'Third item',
        },
    ],
};
