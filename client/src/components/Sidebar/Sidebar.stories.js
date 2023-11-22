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
exports.rightToLeft = exports.withoutSearch = exports.withLargeSubmenu = exports.withNestedSubmenu = exports.standard = void 0;
const React = __importStar(require("react"));
const Sidebar_1 = require("./Sidebar");
const Search_1 = require("./modules/Search");
const MainMenu_1 = require("./modules/MainMenu");
const PageExplorerMenuItem_1 = require("./menu/PageExplorerMenuItem");
const LinkMenuItem_1 = require("./menu/LinkMenuItem");
const SubMenuItem_1 = require("./menu/SubMenuItem");
const WagtailBranding_1 = require("./modules/WagtailBranding");
const range_1 = require("../../utils/range");
exports.default = {
    title: 'Sidebar/Sidebar',
    parameters: { layout: 'fullscreen' },
};
function searchModule() {
    return new Search_1.SearchModuleDefinition('/admin/search/');
}
function bogStandardMenuModule() {
    return new MainMenu_1.MainMenuModuleDefinition([
        new PageExplorerMenuItem_1.PageExplorerMenuItemDefinition({
            name: 'explorer',
            label: 'Pages',
            url: '/admin/pages',
            icon_name: 'folder-open-inverse',
            classnames: '',
        }, 1),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'images',
            label: 'Images',
            url: '/admin/images/',
            icon_name: 'image',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'documents',
            label: 'Documents',
            url: '/admin/documents/',
            icon_name: 'doc-full-inverse',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'snippets',
            label: 'Snippets',
            url: '/admin/snippets/',
            icon_name: 'snippet',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'forms',
            label: 'Forms',
            url: '/admin/forms/',
            icon_name: 'form',
            classnames: '',
        }),
        new SubMenuItem_1.SubMenuItemDefinition({
            name: 'reports',
            label: 'Reports',
            icon_name: 'site',
            classnames: '',
        }, [
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'locked-pages',
                label: 'Locked pages',
                url: '/admin/reports/locked/',
                icon_name: 'lock',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflows',
                label: 'Workflows',
                url: '/admin/reports/workflow/',
                icon_name: 'tasks',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflow-tasks',
                label: 'Workflow tasks',
                url: '/admin/reports/workflow_tasks/',
                icon_name: 'thumbtack',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'site-history',
                label: 'Site history',
                url: '/admin/reports/site-history/',
                icon_name: 'history',
                classnames: '',
            }),
        ]),
        new SubMenuItem_1.SubMenuItemDefinition({
            name: 'settings',
            label: 'Settings',
            icon_name: 'cogs',
            classnames: '',
            footer_text: 'Wagtail Version',
        }, [
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflows',
                label: 'Workflows',
                url: '/admin/workflows/list/',
                icon_name: 'tasks',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflow-tasks',
                label: 'Workflow tasks',
                url: '/admin/workflows/tasks/index/',
                icon_name: 'thumbtack',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'users',
                label: 'Users',
                url: '/admin/users/',
                icon_name: 'user',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'groups',
                label: 'Groups',
                url: '/admin/groups/',
                icon_name: 'group',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'sites',
                label: 'Sites',
                url: '/admin/sites/',
                icon_name: 'site',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'collections',
                label: 'Collections',
                url: '/admin/collections/',
                icon_name: 'folder-open-1',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'redirects',
                label: 'Redirects',
                url: '/admin/redirects/',
                icon_name: 'redirect',
                classnames: '',
            }),
        ]),
    ], [
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'account',
            label: 'Account',
            url: '/admin/account/',
            icon_name: 'user',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'logout',
            label: 'Log out',
            url: '/admin/logout/',
            icon_name: 'logout',
            classnames: '',
        }),
    ], {
        name: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/e31ec811942afbf7b9ce0ac5affe426f?s=200&d=robohash&r=x',
    });
}
function renderSidebarStory(modules, { rtl = false } = {}) {
    // Add branding to all sidebar stories by default
    const wagtailBrandingModule = new WagtailBranding_1.WagtailBrandingModuleDefinition('');
    modules.unshift(wagtailBrandingModule);
    // Simulate navigation
    const [currentPath, setCurrentPath] = React.useState('/admin/');
    const navigate = (url) => {
        setCurrentPath(url);
        // Return resolved promise to close menu immediately
        return Promise.resolve();
    };
    // Add ready class to body to enable CSS transitions
    document.body.classList.add('ready');
    const onExpandCollapse = (collapsed) => {
        if (collapsed) {
            document.body.classList.add('sidebar-collapsed');
        }
        else {
            document.body.classList.remove('sidebar-collapsed');
        }
    };
    if (rtl) {
        document.documentElement.setAttribute('dir', 'rtl');
    }
    else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    return (<div className="wrapper">
      <Sidebar_1.Sidebar collapsedOnLoad={false} modules={modules} currentPath={currentPath} navigate={navigate} onExpandCollapse={onExpandCollapse}/>
      <main id="main" className="content-wrapper">
        <div className="content">
          <b>Current path:</b> {currentPath}
        </div>
      </main>
    </div>);
}
function standard() {
    return renderSidebarStory([searchModule(), bogStandardMenuModule()]);
}
exports.standard = standard;
function withNestedSubmenu() {
    const menuModule = bogStandardMenuModule();
    menuModule.menuItems.push(new SubMenuItem_1.SubMenuItemDefinition({
        name: 'nested-menu',
        label: 'Nested menu',
        icon_name: 'cogs',
        classnames: '',
    }, [
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'item',
            label: 'Item',
            url: '/admin/item/',
            icon_name: 'user',
            classnames: '',
        }),
        new SubMenuItem_1.SubMenuItemDefinition({
            name: 'nested-menu',
            label: 'Nested menu',
            icon_name: 'folder-open-1',
            classnames: '',
        }, [
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'item',
                label: 'Item',
                url: '/admin/item/item/',
                icon_name: 'user',
                classnames: '',
            }),
            new SubMenuItem_1.SubMenuItemDefinition({
                name: 'deeply-nested-menu',
                label: 'Deeply nested menu',
                icon_name: 'side',
                classnames: '',
            }, [
                new LinkMenuItem_1.LinkMenuItemDefinition({
                    name: 'item',
                    label: 'Item',
                    url: '/admin/item/item/item/',
                    icon_name: 'user',
                    classnames: '',
                }),
            ]),
            new SubMenuItem_1.SubMenuItemDefinition({
                name: 'another-deeply-nested-menu',
                label: 'Another deeply nested menu',
                icon_name: 'user',
                classnames: '',
            }, [
                new LinkMenuItem_1.LinkMenuItemDefinition({
                    name: 'item',
                    label: 'Item',
                    url: '/admin/item/item/item2/',
                    icon_name: 'user',
                    classnames: '',
                }),
            ]),
        ]),
    ]));
    return renderSidebarStory([searchModule(), menuModule]);
}
exports.withNestedSubmenu = withNestedSubmenu;
function withLargeSubmenu() {
    const menuModule = bogStandardMenuModule();
    const menuItems = [];
    (0, range_1.range)(0, 100).forEach((i) => {
        menuItems.push(new LinkMenuItem_1.LinkMenuItemDefinition({
            name: `item-${i}`,
            label: `Item ${i}`,
            url: `/admin/item-${i}/`,
            icon_name: 'snippet',
            classnames: '',
        }));
    });
    menuModule.menuItems.push(new SubMenuItem_1.SubMenuItemDefinition({
        name: 'large-menu',
        label: 'Large menu',
        icon_name: 'cogs',
        classnames: '',
        footer_text: 'Footer text',
    }, menuItems));
    return renderSidebarStory([searchModule(), menuModule]);
}
exports.withLargeSubmenu = withLargeSubmenu;
function withoutSearch() {
    return renderSidebarStory([bogStandardMenuModule()]);
}
exports.withoutSearch = withoutSearch;
function arabicMenuModule() {
    return new MainMenu_1.MainMenuModuleDefinition([
        new PageExplorerMenuItem_1.PageExplorerMenuItemDefinition({
            name: 'explorer',
            label: 'صفحات',
            url: '/admin/pages',
            start_page_id: 1,
            icon_name: 'folder-open-inverse',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'images',
            label: 'صور',
            url: '/admin/images/',
            icon_name: 'image',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'documents',
            label: 'وثائق',
            url: '/admin/documents/',
            icon_name: 'doc-full-inverse',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'snippets',
            label: 'قصاصات',
            url: '/admin/snippets/',
            icon_name: 'snippet',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'forms',
            label: 'نماذج',
            url: '/admin/forms/',
            icon_name: 'form',
            classnames: '',
        }),
        new SubMenuItem_1.SubMenuItemDefinition({
            name: 'reports',
            label: 'التقارير',
            icon_name: 'site',
            classnames: '',
        }, [
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'locked-pages',
                label: 'Locked pages',
                url: '/admin/reports/locked/',
                icon_name: 'lock',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflows',
                label: 'Workflows',
                url: '/admin/reports/workflow/',
                icon_name: 'tasks',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflow-tasks',
                label: 'Workflow tasks',
                url: '/admin/reports/workflow_tasks/',
                icon_name: 'thumbtack',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'site-history',
                label: 'Site history',
                url: '/admin/reports/site-history/',
                icon_name: 'history',
                classnames: '',
            }),
        ]),
        new SubMenuItem_1.SubMenuItemDefinition({
            name: 'settings',
            label: 'إعدادات',
            icon_name: 'cogs',
            classnames: '',
        }, [
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflows',
                label: 'Workflows',
                url: '/admin/workflows/list/',
                icon_name: 'tasks',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'workflow-tasks',
                label: 'Workflow tasks',
                url: '/admin/workflows/tasks/index/',
                icon_name: 'thumbtack',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'users',
                label: 'مستخدمين',
                url: '/admin/users/',
                icon_name: 'user',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'groups',
                label: 'مجموعات',
                url: '/admin/groups/',
                icon_name: 'group',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'sites',
                label: 'مواقع',
                url: '/admin/sites/',
                icon_name: 'site',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'collections',
                label: 'مجموعات',
                url: '/admin/collections/',
                icon_name: 'folder-open-1',
                classnames: '',
            }),
            new LinkMenuItem_1.LinkMenuItemDefinition({
                name: 'redirects',
                label: 'اعادة التوجيهات',
                url: '/admin/redirects/',
                icon_name: 'redirect',
                classnames: '',
            }),
        ]),
    ], [
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'account',
            label: 'حساب',
            url: '/admin/account/',
            icon_name: 'user',
            classnames: '',
        }),
        new LinkMenuItem_1.LinkMenuItemDefinition({
            name: 'logout',
            label: 'تسجيل الخروج',
            url: '/admin/logout/',
            icon_name: 'logout',
            classnames: '',
        }),
    ], {
        name: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/e31ec811942afbf7b9ce0ac5affe426f?s=200&d=robohash&r=x',
    });
}
function rightToLeft() {
    return renderSidebarStory([searchModule(), arabicMenuModule()], {
        rtl: true,
    });
}
exports.rightToLeft = rightToLeft;
