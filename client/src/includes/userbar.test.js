"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userbar_1 = require("./userbar");
const mockDocument = `
<div id="a"></div>
<div id="b"></div>
<div id="c"></div>
<div id="d"></div>
`;
// Multiple selectors per violation, multiple violations per selector
const mockViolations = {
    da: { id: 'axe-1', nodes: [{ target: ['#d'] }, { target: ['#a'] }] },
    db: { id: 'axe-2', nodes: [{ target: ['#d'] }, { target: ['#b'] }] },
    third: { id: 'axe-3', nodes: [{ target: ['#c'] }] },
};
describe('sortAxeViolations', () => {
    it('works with no nodes', () => {
        const violations = [
            { id: 'axe-1', nodes: [] },
            { id: 'axe-2', nodes: [] },
        ];
        expect((0, userbar_1.sortAxeViolations)(violations)).toEqual([
            { id: 'axe-1', nodes: [] },
            { id: 'axe-2', nodes: [] },
        ]);
    });
    it('preserves the existing order if correct', () => {
        document.body.innerHTML = mockDocument;
        const violations = [
            mockViolations.da,
            mockViolations.db,
            mockViolations.third,
        ];
        expect((0, userbar_1.sortAxeViolations)(violations)).toEqual([
            mockViolations.da,
            mockViolations.db,
            mockViolations.third,
        ]);
    });
    it('changes the order to match the DOM', () => {
        document.body.innerHTML = mockDocument;
        const violations = [
            mockViolations.third,
            mockViolations.db,
            mockViolations.da,
        ];
        expect((0, userbar_1.sortAxeViolations)(violations)).toEqual([
            mockViolations.da,
            mockViolations.db,
            mockViolations.third,
        ]);
    });
});
