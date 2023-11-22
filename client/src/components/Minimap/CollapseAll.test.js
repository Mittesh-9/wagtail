"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const enzyme_1 = require("enzyme");
const CollapseAll_1 = __importDefault(require("./CollapseAll"));
describe('CollapseAll', () => {
    it('exists', () => {
        expect(CollapseAll_1.default).toBeDefined();
    });
    it('renders', () => {
        const wrapper = (0, enzyme_1.shallow)(<CollapseAll_1.default expanded insideMinimap={false} onClick={() => { }}/>);
        expect(wrapper.text()).toBe('<Icon />Collapse all');
        expect(wrapper.find('button').prop('aria-expanded')).toBe(true);
        expect(wrapper.find('Icon').prop('name')).toBe('collapse-up');
    });
    it('renders with expanded set to false', () => {
        const wrapper = (0, enzyme_1.shallow)(<CollapseAll_1.default expanded={false} insideMinimap={false} onClick={() => { }}/>);
        expect(wrapper.text()).toBe('<Icon />Expand all');
        expect(wrapper.find('button').prop('aria-expanded')).toBe(false);
        expect(wrapper.find('Icon').prop('name')).toBe('collapse-down');
    });
});
