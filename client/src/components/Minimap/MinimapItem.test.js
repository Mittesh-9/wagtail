"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const enzyme_1 = require("enzyme");
const MinimapItem_1 = __importDefault(require("./MinimapItem"));
const mockItem = {
    anchor: document.createElement('a'),
    toggle: document.createElement('button'),
    panel: document.createElement('div'),
    href: '',
    label: 'text with more than 22 characters',
    icon: '',
    required: true,
    errorCount: 1,
    level: 'h1',
};
const mockProps = {
    item: mockItem,
    intersects: false,
    expanded: false,
    onClick: () => { },
};
describe('MinimapItem', () => {
    it('exists', () => {
        expect(MinimapItem_1.default).toBeDefined();
    });
    it('renders error count if has errors', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        const errors = wrapper.find('.w-minimap-item__errors');
        expect(errors.text()).toBe('1');
        expect(errors.prop('aria-label')).toBe('1 error');
    });
    it("doesn't render error count if no errors", () => {
        const item = Object.assign(Object.assign({}, mockItem), { errorCount: 0 });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.find('.w-minimap-item__errors')).toHaveLength(0);
    });
    it('shows correct text for multiple errors', () => {
        const item = Object.assign(Object.assign({}, mockItem), { errorCount: 2 });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.find('.w-minimap-item__errors').prop('aria-label')).toBe('2 errors');
    });
    it('truncates long label texts', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        expect(wrapper.text()).toBe('1<Icon />text with more than 22…*');
    });
    it('does not truncate short label texts', () => {
        const item = Object.assign(Object.assign({}, mockItem), { label: 'short text' });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.text()).toBe('1<Icon />short text*');
    });
    it('applies aria-current by default', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        expect(wrapper.find('a').prop('aria-current')).toBe(false);
    });
    it('applies aria-current when intersects', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} intersects/>);
        expect(wrapper.find('a').prop('aria-current')).toBe(true);
    });
    it('is not focusable by default', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        expect(wrapper.find('a').prop('tabIndex')).toBe(-1);
    });
    it('becomes focusable when expanded', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} expanded/>);
        expect(wrapper.find('a').prop('tabIndex')).toBeUndefined();
    });
    it("doesn't render Icon element if heading level is h1", () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        expect(wrapper.find('.w-minimap-item__icon')).toHaveLength(0);
    });
    it("doesn't render Icon element if heading level is h2", () => {
        const item = Object.assign(Object.assign({}, mockItem), { level: 'h2' });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.find('.w-minimap-item__icon')).toHaveLength(0);
    });
    it('renders Icon element if heading level is not h1 or h2', () => {
        const item = Object.assign(Object.assign({}, mockItem), { level: 'h3' });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.find('.w-minimap-item__icon')).toHaveLength(1);
    });
    it('renders requiredMark element if required', () => {
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps}/>);
        expect(wrapper.find('.w-required-mark')).toHaveLength(1);
    });
    it("doesn't render requiredMark element if not required", () => {
        const item = Object.assign(Object.assign({}, mockItem), { required: false });
        const wrapper = (0, enzyme_1.shallow)(<MinimapItem_1.default {...mockProps} item={item}/>);
        expect(wrapper.find('.w-required-mark')).toHaveLength(0);
    });
});
