"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TextArea = react_1.default.forwardRef(({ value, className, placeholder, onChange, focusOnMount, focusTarget = false, additionalAttributes = {}, }, ref) => {
    const onChangeValue = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };
    // Resize the textarea whenever the value is changed
    const textAreaElement = react_1.default.useRef(null);
    react_1.default.useImperativeHandle(ref, () => textAreaElement.current);
    react_1.default.useEffect(() => {
        if (textAreaElement.current) {
            textAreaElement.current.style.height = '';
            textAreaElement.current.style.height =
                textAreaElement.current.scrollHeight + 'px';
        }
    }, [value, textAreaElement]);
    // Focus the textarea when it is mounted
    react_1.default.useEffect(() => {
        if (focusOnMount && textAreaElement.current) {
            textAreaElement.current.focus();
        }
    }, [textAreaElement]);
    return (<textarea data-focus-target={focusTarget} rows={1} style={{ resize: 'none', overflowY: 'hidden' }} className={className} placeholder={placeholder} ref={textAreaElement} onChange={onChangeValue} value={value} {...additionalAttributes}/>);
});
exports.default = TextArea;
