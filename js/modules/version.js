/**
 * Version Module
 * Handles app version loading and display
 */

export let APP_VERSION = 'v1.3.1'; // Fallback version
export const BUILD_DATE = new Date().toISOString().split('T')[0];

export async function loadVersion() {
    try {
        const response = await fetch('./package.json');
        const data = await response.json();
        APP_VERSION = 'v' + data.version;
        return APP_VERSION;
    } catch (error) {
        console.warn('Could not load version from package.json:', error);
        return APP_VERSION;
    }
}

export function displayVersion() {
    const versionElement = document.getElementById('versionNumber');
    if (versionElement) {
        versionElement.textContent = APP_VERSION;
    }

    const settingsVersion = document.getElementById('settingsVersion');
    if (settingsVersion) {
        settingsVersion.textContent = `Version: ${APP_VERSION}`;
    }
}

export async function initVersion() {
    await loadVersion();
    displayVersion();
}
