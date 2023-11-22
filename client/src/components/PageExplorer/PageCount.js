"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gettext_1 = require("../../utils/gettext");
const wagtailConfig_1 = require("../../config/wagtailConfig");
const Icon_1 = __importDefault(require("../Icon/Icon"));
const PageCount = ({ page }) => {
    const count = page.children.count;
    return (<a href={`${wagtailConfig_1.ADMIN_URLS.PAGES}${page.id}/`} className="c-page-explorer__see-more">
      {(0, gettext_1.gettext)('See all')}
      <span>{` ${count} ${count === 1
            ? (0, gettext_1.gettext)('Page').toLowerCase()
            : (0, gettext_1.gettext)('Pages').toLowerCase()}`}</span>
      <Icon_1.default name="arrow-right"/>
    </a>);
};
exports.default = PageCount;
