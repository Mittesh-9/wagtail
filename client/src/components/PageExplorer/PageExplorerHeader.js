"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const wagtailConfig_1 = require("../../config/wagtailConfig");
const gettext_1 = require("../../utils/gettext");
const Button_1 = __importDefault(require("../Button/Button"));
const Icon_1 = __importDefault(require("../Icon/Icon"));
const SelectLocale = ({ locale, translations, gotoPage, }) => {
    /* eslint-disable camelcase */
    const options = wagtailConfig.LOCALES.filter(({ code }) => code === locale || translations.get(code)).map(({ code, display_name }) => (<option key={code} value={code}>
      {display_name}
    </option>));
    /* eslint-enable camelcase */
    const onChange = (e) => {
        e.preventDefault();
        const translation = translations.get(e.target.value);
        if (translation) {
            gotoPage(translation, 0);
        }
    };
    return (<div className="c-page-explorer__header__select">
      <select value={locale} onChange={onChange} disabled={options.length < 2}>
        {options}
      </select>
    </div>);
};
/**
 * The bar at the top of the explorer, displaying the current level
 * and allowing access back to the parent level.
 */
const PageExplorerHeader = ({ page, depth, onClick, gotoPage, navigate, }) => {
    const isRoot = depth === 0;
    const isSiteRoot = page.id === 0;
    return (<div className="c-page-explorer__header">
      <Button_1.default href={!isSiteRoot ? `${wagtailConfig_1.ADMIN_URLS.PAGES}${page.id}/` : wagtailConfig_1.ADMIN_URLS.PAGES} className="c-page-explorer__header__title" onClick={onClick} navigate={navigate}>
        <div className="c-page-explorer__header__title__inner">
          <Icon_1.default name={isRoot ? 'home' : 'arrow-left'} className="icon--explorer-header"/>
          <span>{page.admin_display_title || (0, gettext_1.gettext)('Pages')}</span>
        </div>
      </Button_1.default>
      {!isSiteRoot &&
            page.meta.locale &&
            page.translations &&
            page.translations.size > 0 && (<SelectLocale locale={page.meta.locale} translations={page.translations} gotoPage={gotoPage}/>)}
    </div>);
};
exports.default = PageExplorerHeader;
