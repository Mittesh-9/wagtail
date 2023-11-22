"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreControllerDefinitions = void 0;
// Order controller imports alphabetically.
const ActionController_1 = require("./ActionController");
const AutosizeController_1 = require("./AutosizeController");
const BulkController_1 = require("./BulkController");
const CountController_1 = require("./CountController");
const DialogController_1 = require("./DialogController");
const DismissibleController_1 = require("./DismissibleController");
const DropdownController_1 = require("./DropdownController");
const CloneController_1 = require("./CloneController");
const ProgressController_1 = require("./ProgressController");
const RevealController_1 = require("./RevealController");
const SkipLinkController_1 = require("./SkipLinkController");
const SlugController_1 = require("./SlugController");
const SubmitController_1 = require("./SubmitController");
const SwapController_1 = require("./SwapController");
const SyncController_1 = require("./SyncController");
const TagController_1 = require("./TagController");
const TeleportController_1 = require("./TeleportController");
const TooltipController_1 = require("./TooltipController");
const UpgradeController_1 = require("./UpgradeController");
/**
 * Important: Only add default core controllers that should load with the base admin JS bundle.
 */
exports.coreControllerDefinitions = [
    // Keep this list in alphabetical order
    { controllerConstructor: ActionController_1.ActionController, identifier: 'w-action' },
    { controllerConstructor: AutosizeController_1.AutosizeController, identifier: 'w-autosize' },
    { controllerConstructor: BulkController_1.BulkController, identifier: 'w-bulk' },
    { controllerConstructor: CloneController_1.CloneController, identifier: 'w-clone' },
    { controllerConstructor: CloneController_1.CloneController, identifier: 'w-messages' },
    { controllerConstructor: CountController_1.CountController, identifier: 'w-count' },
    { controllerConstructor: DialogController_1.DialogController, identifier: 'w-dialog' },
    { controllerConstructor: DismissibleController_1.DismissibleController, identifier: 'w-dismissible' },
    { controllerConstructor: DropdownController_1.DropdownController, identifier: 'w-dropdown' },
    { controllerConstructor: ProgressController_1.ProgressController, identifier: 'w-progress' },
    { controllerConstructor: RevealController_1.RevealController, identifier: 'w-breadcrumbs' },
    { controllerConstructor: RevealController_1.RevealController, identifier: 'w-reveal' },
    { controllerConstructor: SkipLinkController_1.SkipLinkController, identifier: 'w-skip-link' },
    { controllerConstructor: SlugController_1.SlugController, identifier: 'w-slug' },
    { controllerConstructor: SubmitController_1.SubmitController, identifier: 'w-submit' },
    { controllerConstructor: SwapController_1.SwapController, identifier: 'w-swap' },
    { controllerConstructor: SyncController_1.SyncController, identifier: 'w-sync' },
    { controllerConstructor: TagController_1.TagController, identifier: 'w-tag' },
    { controllerConstructor: TeleportController_1.TeleportController, identifier: 'w-teleport' },
    { controllerConstructor: TooltipController_1.TooltipController, identifier: 'w-tooltip' },
    { controllerConstructor: UpgradeController_1.UpgradeController, identifier: 'w-upgrade' },
];
