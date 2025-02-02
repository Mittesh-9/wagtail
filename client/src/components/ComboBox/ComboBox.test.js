"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const enzyme_1 = require("enzyme");
const ComboBox_1 = __importDefault(require("./ComboBox"));
const Icon_1 = __importDefault(require("../Icon/Icon"));
const testProps = {
    label: 'Search options…',
    placeholder: 'Search options…',
    getItemLabel: (_, item) => item.label,
    getItemDescription: (item) => item.description,
    getSearchFields: (item) => [item.label, item.description, item.type],
    noResultsText: 'No results, sorry!',
    onSelect: () => { },
};
describe('ComboBox', () => {
    it('renders empty', () => {
        const wrapper = (0, enzyme_1.shallow)(<ComboBox_1.default {...testProps} items={[]}/>);
        expect(wrapper.find('.w-combobox__status').text()).toBe('No results, sorry!');
    });
    describe('rendering', () => {
        let items;
        let wrapper;
        beforeEach(() => {
            items = [
                {
                    type: 'blockTypes',
                    label: 'Blocks',
                    items: [
                        {
                            type: 'blockquote',
                            description: 'Blockquote',
                            icon: 'blockquote',
                        },
                        {
                            type: 'paragraph',
                            description: 'Paragraph',
                            icon: <span className="custom-icon">P</span>,
                        },
                        {
                            type: 'heading-one',
                            label: 'H1',
                            description: 'Heading 1',
                        },
                        {
                            type: 'heading-two',
                            label: 'H2',
                            render: ({ option }) => (<span className="custom-text">{option.label}</span>),
                        },
                    ],
                },
                {
                    type: 'entityTypes',
                    items: [
                        {
                            type: 'link',
                            label: '🔗',
                            description: 'Link',
                        },
                    ],
                },
            ];
            wrapper = (0, enzyme_1.shallow)(<ComboBox_1.default {...testProps} items={items}/>);
        });
        it('shows items', () => {
            const options = wrapper.find('.w-combobox__option-text');
            expect(options).toHaveLength(items[0].items.length + items[1].items.length);
            expect(options.at(0).text()).toBe('Blockquote');
        });
        it('uses Icon component', () => {
            expect(wrapper.find(Icon_1.default).at(0).prop('name')).toBe('blockquote');
        });
        it('supports custom icons', () => {
            expect(wrapper.find('.custom-icon').text()).toBe('P');
        });
        it('supports label as icon', () => {
            expect(wrapper.find('.custom-text').text()).toBe('H2');
        });
        it('combines two categories into one, with two columns', () => {
            expect(wrapper.find('.w-combobox__optgroup-label')).toHaveLength(1);
            expect(wrapper.find('.w-combobox__option--col1')).toHaveLength(3);
            expect(wrapper.find('.w-combobox__option--col2')).toHaveLength(2);
        });
    });
});
