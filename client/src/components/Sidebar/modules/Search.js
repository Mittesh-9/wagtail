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
exports.SearchModuleDefinition = exports.SearchInput = void 0;
const React = __importStar(require("react"));
const react_1 = __importDefault(require("@tippyjs/react"));
const gettext_1 = require("../../../utils/gettext");
const Icon_1 = __importDefault(require("../../Icon/Icon"));
const Sidebar_1 = require("../Sidebar");
const SearchInput = ({ slim, expandingOrCollapsing, onSearchClick, searchUrl, navigate, }) => {
    const isVisible = !slim || expandingOrCollapsing;
    const searchInput = React.useRef(null);
    const onSubmitForm = (e) => {
        if (e.target instanceof HTMLFormElement) {
            e.preventDefault();
            if (isVisible) {
                const inputElement = e.target.querySelector('input[name="q"]');
                navigate(searchUrl + '?q=' + encodeURIComponent(inputElement.value));
            }
            else {
                navigate(searchUrl);
            }
        }
    };
    return (<form role="search" className="w-h-[42px] w-relative w-box-border w-flex w-items-center w-justify-start w-flex-row w-flex-shrink-0" action={searchUrl} method="get" onSubmit={onSubmitForm}>
      <div className="w-flex w-flex-row w-items-center w-h-full">
        <react_1.default disabled={isVisible || !slim} content={(0, gettext_1.gettext)('Search')} placement="right">
          {/* Use padding left 23px to align icon in slim mode and padding right 18px to ensure focus is full width */}
          <button className={`
          ${slim ? 'w-pr-[18px]' : 'w-pr-0'}
          w-w-full
          w-pl-[23px]
          w-h-[35px]
          w-bg-transparent
          w-outline-offset-inside
          w-border-0
          w-rounded-none
          w-text-text-label-menus-default
          w-z-10
          hover:w-text-text-label-menus-active
          focus:w-text-text-label-menus-active
          hover:w-bg-transparent`} type="submit" aria-label={(0, gettext_1.gettext)('Search')} onClick={(e) => {
            if (slim) {
                e.preventDefault();
                onSearchClick();
                // Focus search input after transition when button is clicked in slim mode
                setTimeout(() => {
                    if (searchInput.current) {
                        searchInput.current.focus();
                    }
                }, Sidebar_1.SIDEBAR_TRANSITION_DURATION);
            }
        }}>
            <Icon_1.default className="icon--menuitem" name="search"/>
          </button>
        </react_1.default>

        <label className="w-sr-only" htmlFor="menu-search-q">
          {(0, gettext_1.gettext)('Search')}
        </label>

        {/* Classes marked important to trump the base input styling set in _forms.scss */}
        <input className={`
            ${slim || !isVisible ? 'w-hidden' : ''}
            !w-pl-[55px]
            !w-py-[13px]
            !w-subpixel-antialiased
            !w-absolute
            !w-left-0
            !w-font-normal
            !w-top-0
            !w-text-14
            !w-bg-transparent
            !w-border-0
            !w-rounded-none
            !w-text-text-label-menus-default
            !w-outline-offset-inside
            !w-leading-none
            placeholder:!w-text-text-label-menus-default`} type="text" id="menu-search-q" name="q" placeholder={(0, gettext_1.gettext)('Search')} ref={searchInput}/>
      </div>
    </form>);
};
exports.SearchInput = SearchInput;
class SearchModuleDefinition {
    constructor(searchUrl) {
        this.searchUrl = searchUrl;
    }
    render({ slim, key, expandingOrCollapsing, onSearchClick, navigate }) {
        return (<exports.SearchInput searchUrl={this.searchUrl} slim={slim} key={key} expandingOrCollapsing={expandingOrCollapsing} onSearchClick={onSearchClick} navigate={navigate}/>);
    }
}
exports.SearchModuleDefinition = SearchModuleDefinition;
