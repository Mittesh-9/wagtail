"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIconSprite = void 0;
const domReady = () => new Promise((resolve) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve(), {
            once: true,
            passive: true,
        });
    }
    else {
        resolve();
    }
});
/**
 * Loads sprite data from either Local Storage or via async fetch.
 * Ensures the sprite data is backed up when pulled in from API.
 */
const initIconSprite = (spriteContainer, spriteURL, revisionKey = 'wagtail:spriteRevision', dataKey = 'wagtail:spriteData') => {
    const hasLocalStorage = 'localStorage' in window && typeof window.localStorage !== 'undefined';
    const insert = (data) => {
        if (!spriteContainer || !data)
            return;
        domReady().then(() => {
            // eslint-disable-next-line no-param-reassign
            spriteContainer.innerHTML = data;
        });
    };
    if (hasLocalStorage && localStorage.getItem(revisionKey) === spriteURL) {
        const data = localStorage.getItem(dataKey);
        insert(data);
    }
    fetch(spriteURL)
        .then((response) => response.text())
        .then((data) => {
        insert(data);
        if (hasLocalStorage) {
            localStorage.setItem(dataKey, data);
            localStorage.setItem(revisionKey, spriteURL);
        }
    })
        .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`Error fetching ${spriteURL}. Error: ${error}`);
    });
};
exports.initIconSprite = initIconSprite;
