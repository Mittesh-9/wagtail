"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../utils/gettext");
const wagtailConfig_1 = require("../../config/wagtailConfig");
const Icon_1 = __importDefault(require("../Icon/Icon"));
const Button_1 = __importDefault(require("../Button/Button"));
const PublicationStatus_1 = __importDefault(require("../PublicationStatus/PublicationStatus"));
// Hoist icons in the explorer item, as it is re-rendered many times.
const childrenIcon = <Icon_1.default name="folder-inverse" className="icon--menuitem"/>;
/**
 * One menu item in the page explorer, with different available actions
 * and information depending on the metadata of the page.
 */
const PageExplorerItem = ({ item, onClick, navigate, }) => {
    var _a;
    const { id, admin_display_title: title, meta } = item;
    const hasChildren = meta.children.count > 0;
    const isPublished = meta.status.live && !meta.status.has_unpublished_changes;
    const localeName = ((_a = meta.parent) === null || _a === void 0 ? void 0 : _a.id) === 1 &&
        meta.locale &&
        (wagtailConfig_1.LOCALE_NAMES.get(meta.locale) || meta.locale);
    return (<div className="c-page-explorer__item">
      <Button_1.default href={`${wagtailConfig_1.ADMIN_URLS.PAGES}${id}/`} navigate={navigate} className="c-page-explorer__item__link">
        {hasChildren ? childrenIcon : null}
        <h3 className="c-page-explorer__item__title">{title}</h3>

        {(!isPublished || localeName) && (<span className="c-page-explorer__meta">
            {localeName && (<span className="o-pill c-status">{localeName}</span>)}
            {!isPublished && <PublicationStatus_1.default status={meta.status}/>}
          </span>)}
      </Button_1.default>
      <Button_1.default href={`${wagtailConfig_1.ADMIN_URLS.PAGES}${id}/edit/`} className="c-page-explorer__item__action c-page-explorer__item__action--small" navigate={navigate}>
        <Icon_1.default name="edit" title={(0, gettext_1.gettext)("Edit '%(title)s'").replace('%(title)s', title || '')} className="icon--item-action"/>
      </Button_1.default>
      {hasChildren ? (<Button_1.default className="c-page-explorer__item__action" onClick={onClick} href={`${wagtailConfig_1.ADMIN_URLS.PAGES}${id}/`} navigate={navigate}>
          <Icon_1.default name="arrow-right" title={(0, gettext_1.gettext)("View child pages of '%(title)s'").replace('%(title)s', title || '')} className="icon--item-action"/>
        </Button_1.default>) : null}
    </div>);
};
exports.default = PageExplorerItem;
