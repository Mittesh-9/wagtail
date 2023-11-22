"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeController = void 0;
const stimulus_1 = require("@hotwired/stimulus");
const version_1 = require("../utils/version");
/**
 * Controls the upgrade notification component to request the latest version
 * of Wagtail and presents a message to the user if the current version
 * is out of date.
 *
 * Expected JSON payload:
 *
 * {
 *     "version": "2.15.2",
 *     "url":     "https://docs.wagtail.io/en/stable/releases/2.15.2.html",
 *     "minorUrl": "https://docs.wagtail.io/en/stable/releases/2.15.html",
 *     "lts": {
 *         "version": "2.12.8",
 *         "url": "https://docs.wagtail.io/en/stable/releases/2.12.8.html",
 *         "minorUrl": "https://docs.wagtail.io/en/stable/releases/2.12.html"
 *     }
 * }
 */
class UpgradeController extends stimulus_1.Controller {
    connect() {
        this.checkVersion();
    }
    checkVersion() {
        const releasesUrl = this.urlValue;
        const currentVersion = new version_1.VersionNumber(this.currentVersionValue);
        const showLTSOnly = this.ltsOnlyValue;
        fetch(releasesUrl, {
            referrerPolicy: 'strict-origin-when-cross-origin',
        })
            .then((response) => {
            if (response.status !== 200) {
                throw Error(`Unexpected response from ${releasesUrl}. Status: ${response.status}`);
            }
            return response.json();
        })
            .then((payload) => {
            let data = payload;
            if (data && data.lts && showLTSOnly) {
                data = data.lts;
            }
            if (data && data.version) {
                const latestVersion = new version_1.VersionNumber(data.version);
                const versionDelta = currentVersion.howMuchBehind(latestVersion);
                let releaseNotesUrl = null;
                if (!versionDelta) {
                    return;
                }
                if (versionDelta === version_1.VersionDeltaType.MAJOR ||
                    versionDelta === version_1.VersionDeltaType.MINOR) {
                    releaseNotesUrl = data.minorUrl;
                }
                else {
                    releaseNotesUrl = data.url;
                }
                if (this.latestVersionTarget instanceof HTMLElement) {
                    const versionLabel = [data.version, showLTSOnly ? '(LTS)' : '']
                        .join(' ')
                        .trim();
                    this.latestVersionTarget.textContent = versionLabel;
                }
                if (this.linkTarget instanceof HTMLElement) {
                    this.linkTarget.setAttribute('href', releaseNotesUrl || '');
                }
                this.element.classList.remove(this.hiddenClass);
            }
        })
            .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`Error fetching ${releasesUrl}. Error: ${err}`);
        });
    }
}
exports.UpgradeController = UpgradeController;
UpgradeController.classes = ['hidden'];
UpgradeController.targets = ['latestVersion', 'link'];
UpgradeController.values = {
    currentVersion: String,
    ltsOnly: { default: false, type: Boolean },
    url: { default: 'https://releases.wagtail.org/latest.txt', type: String },
};
