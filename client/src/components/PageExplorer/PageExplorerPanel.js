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
const react_1 = __importDefault(require("react"));
const focus_trap_react_1 = __importDefault(require("focus-trap-react"));
const gettext_1 = require("../../utils/gettext");
const wagtailConfig_1 = require("../../config/wagtailConfig");
const LoadingSpinner_1 = __importDefault(require("../LoadingSpinner/LoadingSpinner"));
const Transition_1 = __importStar(require("../Transition/Transition"));
const PageExplorerHeader_1 = __importDefault(require("./PageExplorerHeader"));
const PageExplorerItem_1 = __importDefault(require("./PageExplorerItem"));
const PageCount_1 = __importDefault(require("./PageCount"));
/**
 * The main panel of the page explorer menu, with heading,
 * menu items, and special states.
 */
class PageExplorerPanel extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            transition: Transition_1.PUSH,
        };
        this.onItemClick = this.onItemClick.bind(this);
        this.onHeaderClick = this.onHeaderClick.bind(this);
    }
    componentWillReceiveProps(newProps) {
        const { depth } = this.props;
        const isPush = newProps.depth > depth;
        this.setState({
            transition: isPush ? Transition_1.PUSH : Transition_1.POP,
        });
    }
    onItemClick(id, e) {
        const { gotoPage } = this.props;
        e.preventDefault();
        e.stopPropagation();
        gotoPage(id, 1);
    }
    onHeaderClick(e) {
        var _a;
        const { page, depth, gotoPage } = this.props;
        const parent = (_a = page.meta.parent) === null || _a === void 0 ? void 0 : _a.id;
        // Note: Checking depth as well in case the user started deep in the tree
        if (depth > 0 && parent) {
            e.preventDefault();
            e.stopPropagation();
            gotoPage(parent, -1);
        }
    }
    renderChildren() {
        const { page, nodes } = this.props;
        let children;
        if (!page.isFetchingChildren && !page.children.items) {
            children = (<div key="empty" className="c-page-explorer__placeholder">
          {(0, gettext_1.gettext)('No results')}
        </div>);
        }
        else {
            children = (<div key="children">
          {page.children.items.map((id) => (<PageExplorerItem_1.default key={id} item={nodes[id]} onClick={this.onItemClick.bind(null, id)} navigate={this.props.navigate}/>))}
        </div>);
        }
        return (<div className="c-page-explorer__drawer">
        {children}
        {page.isFetchingChildren || page.isFetchingTranslations ? (<div key="fetching" className="c-page-explorer__placeholder">
            <LoadingSpinner_1.default />
          </div>) : null}
        {page.isError ? (<div key="error" className="c-page-explorer__placeholder">
            {(0, gettext_1.gettext)('Server Error')}
          </div>) : null}
      </div>);
    }
    render() {
        const { page, depth, gotoPage, onClose } = this.props;
        const { transition } = this.state;
        return (<focus_trap_react_1.default paused={!page || page.isFetchingChildren || page.isFetchingTranslations} focusTrapOptions={{
                onDeactivate: onClose,
                clickOutsideDeactivates: false,
                allowOutsideClick: true,
            }}>
        <div role="dialog" aria-label={(0, gettext_1.gettext)('Page explorer')}>
          <Transition_1.default name={transition} className="c-page-explorer">
            <div key={depth} className="c-transition-group">
              <PageExplorerHeader_1.default depth={depth} page={page} onClick={this.onHeaderClick} gotoPage={gotoPage} navigate={this.props.navigate}/>

              {this.renderChildren()}

              {page.isError ||
                (page.children.items &&
                    page.children.count > wagtailConfig_1.MAX_EXPLORER_PAGES) ? (<PageCount_1.default page={page}/>) : null}
            </div>
          </Transition_1.default>
        </div>
      </focus_trap_react_1.default>);
    }
}
exports.default = PageExplorerPanel;
