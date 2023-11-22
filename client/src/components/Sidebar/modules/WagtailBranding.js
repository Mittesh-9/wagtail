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
exports.WagtailBrandingModuleDefinition = void 0;
const React = __importStar(require("react"));
const gettext_1 = require("../../../utils/gettext");
const WagtailLogo_1 = __importDefault(require("./WagtailLogo"));
const WagtailBranding = ({ homeUrl, slim, currentPath, navigate, }) => {
    const brandingLogo = React.useMemo(() => document.querySelector('[data-wagtail-sidebar-branding-logo]'), []);
    const hasCustomBranding = brandingLogo && brandingLogo.innerHTML !== '';
    const onClick = (e) => {
        // Do not capture click events with modifier keys or non-main buttons.
        if (e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button !== 0)) {
            return;
        }
        e.preventDefault();
        navigate(homeUrl);
    };
    // Render differently if custom branding is provided.
    // This will only ever render once, so rendering before hooks is ok.
    if (hasCustomBranding) {
        return (<a className="sidebar-custom-branding" href={homeUrl} aria-label={(0, gettext_1.gettext)('Dashboard')} aria-current={currentPath === homeUrl ? 'page' : undefined} dangerouslySetInnerHTML={{
                __html: brandingLogo ? brandingLogo.innerHTML : '',
            }}/>);
    }
    // Tail wagging
    // If the pointer changes direction 8 or more times without leaving, wag the tail!
    const lastMouseX = React.useRef(0);
    const lastDir = React.useRef('r');
    const dirChangeCount = React.useRef(0);
    const [isWagging, setIsWagging] = React.useState(false);
    const onMouseMove = (e) => {
        const mouseX = e.pageX;
        const dir = mouseX > lastMouseX.current ? 'r' : 'l';
        if (mouseX !== lastMouseX.current && dir !== lastDir.current) {
            dirChangeCount.current += 1;
        }
        if (dirChangeCount.current > 8) {
            setIsWagging(true);
        }
        lastMouseX.current = mouseX;
        lastDir.current = dir;
    };
    const onMouseLeave = () => {
        setIsWagging(false);
        dirChangeCount.current = 0;
    };
    const desktopClassName = 'sidebar-wagtail-branding w-transition-all w-duration-150' +
        (isWagging ? ' sidebar-wagtail-branding--wagging' : '');
    return (<a className={desktopClassName} href={homeUrl} aria-label={(0, gettext_1.gettext)('Dashboard')} aria-current={currentPath === homeUrl ? 'page' : undefined} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="sidebar-wagtail-branding__icon-wrapper w-transition-all w-duration-150">
        <WagtailLogo_1.default slim={slim}/>
      </div>
    </a>);
};
class WagtailBrandingModuleDefinition {
    constructor(homeUrl) {
        this.homeUrl = homeUrl;
    }
    render({ slim, key, navigate, currentPath }) {
        return (<WagtailBranding key={key} homeUrl={this.homeUrl} slim={slim} navigate={navigate} currentPath={currentPath}/>);
    }
}
exports.WagtailBrandingModuleDefinition = WagtailBrandingModuleDefinition;
