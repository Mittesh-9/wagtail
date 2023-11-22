"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const findMatches_1 = __importStar(require("./findMatches"));
describe('findMatches', () => {
    describe.each `
    label                           | string    | substring   | result
    ${'full match'}                 | ${'abcä'} | ${'abcä'}   | ${true}
    ${'start match'}                | ${'abcä'} | ${'ab'}     | ${true}
    ${'end match'}                  | ${'abcä'} | ${'cä'}     | ${true}
    ${'base full match'}            | ${'abcä'} | ${'abca'}   | ${true}
    ${'base partial match'}         | ${'abcä'} | ${'ca'}     | ${true}
    ${'base full match reverse'}    | ${'abca'} | ${'abcä'}   | ${true}
    ${'base partial match reverse'} | ${'abca'} | ${'cä'}     | ${true}
    ${'no match'}                   | ${'abcä'} | ${'potato'} | ${false}
  `('contains', ({ label, string, substring, result }) => {
        test(label, () => {
            expect((0, findMatches_1.contains)(string, substring)).toBe(result);
        });
    });
    const findMatchesItems = [
        { label: 'label', desc: '' },
        { label: '', desc: 'description' },
        { label: 'abcä', desc: 'abcä' },
        { label: 'abca', desc: 'abca' },
        { label: 'ab', desc: 'ab' },
        { label: null, desc: null },
        { label: undefined, desc: undefined },
    ];
    describe.each `
    label                 | input            | results
    ${'one match label'}  | ${'label'}       | ${[0]}
    ${'one match desc'}   | ${'description'} | ${[1]}
    ${'multiple matches'} | ${'ab'}          | ${[2, 3, 4]}
    ${'base match'}       | ${'ca'}          | ${[2, 3]}
  `('findMatches', ({ label, input, results }) => {
        test(label, () => {
            const getSearchFields = (i) => [i.label, i.desc];
            expect((0, findMatches_1.default)(findMatchesItems, getSearchFields, input)).toEqual(expect.arrayContaining(results.map((i) => findMatchesItems[i])));
        });
    });
});
