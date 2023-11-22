"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multiple = exports.Single = exports.Base = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("storybook-django/src/react");
const tabs_1 = require("../../../../../client/src/includes/tabs");
const tabbed_interface_html_1 = __importDefault(require("./tabbed_interface.html"));
document.addEventListener('DOMContentLoaded', () => {
    (0, tabs_1.initTabs)();
});
const { docs, argTypes } = (0, react_2.generateDocs)(tabbed_interface_html_1.default);
exports.default = {
    title: 'Shared / Tabs / TabbedInterface',
    parameters: { docs },
    argTypes: Object.assign({}, argTypes),
};
const Template = (args) => <react_2.Pattern filename={__filename} context={args}/>;
exports.Base = Template.bind({});
exports.Base.args = {
    self: {
        visible_children_with_identifiers: [
            [
                {
                    heading: 'Content',
                    render_as_object: `<h2>Content</h2><div>Content Body</div>`,
                },
                'content',
            ],
            [
                {
                    heading: 'Promote',
                    render_as_object: `<h2>Promote</h2><div>Promote Body</div>`,
                },
                'promote',
            ],
            [
                {
                    heading: 'Settings',
                    render_as_object: `<h2>Settings</h2><div>Settings Body</div>`,
                },
                'settings',
            ],
        ],
    },
};
exports.Single = Template.bind({});
exports.Single.args = {
    self: {
        visible_children_with_identifiers: [
            [
                {
                    heading: 'Tab1',
                    render_as_object: `<h2>Title1</h2><div>Body Text</div>`,
                },
                '1',
            ],
        ],
    },
};
exports.Multiple = Template.bind({});
exports.Multiple.args = {
    self: {
        visible_children_with_identifiers: [
            [
                {
                    heading: 'Tab1',
                    render_as_object: `<h1>Title 1</h1><div>Body Text</div>`,
                },
                '1',
            ],
            [
                {
                    heading: 'Tab2',
                    render_as_object: `<h1>Title 2</h1><div>Body Text</div>`,
                },
                '2',
            ],
            [
                {
                    heading: 'Tab3',
                    render_as_object: `<h1>Title 3</h1><div>Body Text</div>`,
                },
                '3',
            ],
            [
                {
                    heading: 'Tab4',
                    render_as_object: `<h1>Title 4</h1><div>Body Text</div>`,
                },
                '4',
            ],
            [
                {
                    heading: 'Tab5',
                    render_as_object: `<h1>Title 5</h1><div>Body Text</div>`,
                },
                '5',
            ],
        ],
    },
};
