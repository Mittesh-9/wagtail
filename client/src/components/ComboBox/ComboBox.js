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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseComboboxStateChange = exports.comboBoxNoResults = exports.comboBoxLabel = exports.comboBoxTriggerLabel = void 0;
const react_1 = __importStar(require("react"));
const downshift_1 = require("downshift");
Object.defineProperty(exports, "UseComboboxStateChange", { enumerable: true, get: function () { return downshift_1.UseComboboxStateChange; } });
const gettext_1 = require("../../utils/gettext");
const Icon_1 = __importDefault(require("../Icon/Icon"));
const findMatches_1 = __importDefault(require("./findMatches"));
exports.comboBoxTriggerLabel = (0, gettext_1.gettext)('Insert a block');
exports.comboBoxLabel = (0, gettext_1.gettext)('Search options…');
exports.comboBoxNoResults = (0, gettext_1.gettext)('No results');
/**
 * Generic ComboBox component built with downshift, with a 2-column layout.
 */
function ComboBox({ label, placeholder, inputValue, items, getItemLabel, getItemDescription, getSearchFields, onSelect, noResultsText, }) {
    // If there is no label defined, we treat the combobox as not needing its own field.
    const inlineCombobox = !label;
    const flatItems = items.flatMap((category) => category.items || []);
    const [inputItems, setInputItems] = (0, react_1.useState)(flatItems);
    // Re-create the categories so the two-column layout flows as expected.
    const categories = items.reduce((cats, cat, index) => {
        if (cat.label || index === 0) {
            return [...cats, Object.assign(Object.assign({}, cat), { items: cat.items.slice() })];
        }
        // eslint-disable-next-line no-param-reassign
        cats[index - 1].items = cats[index - 1].items.concat(cat.items);
        return cats;
    }, []);
    const noResults = inputItems.length === 0;
    const { getLabelProps, getMenuProps, getInputProps, getItemProps, setHighlightedIndex, setInputValue, openMenu, } = (0, downshift_1.useCombobox)(Object.assign(Object.assign({}, (typeof inputValue !== 'undefined' && { inputValue })), { initialInputValue: inputValue || '', items: inputItems, itemToString(item) {
            if (!item) {
                return '';
            }
            return getItemDescription(item) || getItemLabel(item.type, item) || '';
        }, selectedItem: null, 
        // Call onSelect only on item click and enter key press events
        onSelectedItemChange: (changes) => {
            const changeType = changes.type;
            switch (changeType) {
                case downshift_1.useCombobox.stateChangeTypes.InputKeyDownEnter:
                case downshift_1.useCombobox.stateChangeTypes.ItemClick:
                    onSelect(changes);
                    break;
                default:
                    break;
            }
        }, 
        // For not re-setting and not removing focus from combobox when pressing `Alt+Tab`
        // to switch windows.
        stateReducer: (state, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            switch (type) {
                case downshift_1.useCombobox.stateChangeTypes.InputBlur:
                    return Object.assign(Object.assign({}, changes), { isOpen: state.isOpen, highlightedIndex: state.highlightedIndex, inputValue: state.inputValue });
                default:
                    return changes;
            }
        }, onInputValueChange: (changes) => {
            const { inputValue: val } = changes;
            if (!val) {
                setInputItems(flatItems);
                return;
            }
            const filtered = (0, findMatches_1.default)(flatItems, getSearchFields, val);
            setInputItems(filtered);
            // Always reset the first item to highlighted on filtering, to speed up selection.
            setHighlightedIndex(0);
        } }));
    (0, react_1.useEffect)(() => {
        if (inputValue) {
            openMenu();
            setInputValue(inputValue);
            const filtered = (0, findMatches_1.default)(flatItems, getSearchFields, inputValue);
            setInputItems(filtered);
            // Always reset the first item to highlighted on filtering, to speed up selection.
            setHighlightedIndex(0);
        }
        else {
            setInputValue('');
            setInputItems(flatItems);
            setHighlightedIndex(-1);
        }
    }, [inputValue]);
    return (<div className="w-combobox">
      {/* downshift does the label-field association itself. */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label {...getLabelProps()} className="w-sr-only">
        {label}
      </label>
      <div className="w-combobox__field">
        <input {...getInputProps()} type="text" 
    // Prevent the field from receiving focus if it’s not visible.
    disabled={inlineCombobox} placeholder={placeholder}/>
      </div>
      {noResults ? (<div className="w-combobox__status">{noResultsText}</div>) : null}
      <div {...getMenuProps()} className="w-combobox__menu">
        {categories.map((category) => {
            const categoryItems = (category.items || []).filter((item) => inputItems.find((i) => i.type === item.type));
            const itemColumns = Math.ceil(categoryItems.length / 2);
            if (categoryItems.length === 0) {
                return null;
            }
            return (<div className="w-combobox__optgroup" key={category.type}>
              {category.label ? (<div className="w-combobox__optgroup-label">
                  {category.label}
                </div>) : null}
              {categoryItems.map((item, index) => {
                    const itemLabel = getItemLabel(item.type, item);
                    const description = getItemDescription(item);
                    const itemIndex = inputItems.findIndex((i) => i.type === item.type);
                    const itemColumn = index + 1 <= itemColumns ? 1 : 2;
                    const hasIcon = typeof item.icon !== 'undefined' && item.icon !== null;
                    let icon = null;
                    if (hasIcon) {
                        icon =
                            typeof item.icon === 'string' ? (<Icon_1.default name={item.icon}/>) : (item.icon);
                    }
                    return (<div key={item.type} {...getItemProps({ item, index: itemIndex })} className={`w-combobox__option w-combobox__option--col${itemColumn}`}>
                    <div className="w-combobox__option-icon">
                      {icon}
                      {/* Support for rich text options using text as an icon (for example "B" for bold). */}
                      {itemLabel && !hasIcon ? <span>{itemLabel}</span> : null}
                    </div>
                    <div className="w-combobox__option-text">
                      {item.render
                            ? item.render({ option: item })
                            : description}
                    </div>
                  </div>);
                })}
            </div>);
        })}
      </div>
    </div>);
}
exports.default = ComboBox;
