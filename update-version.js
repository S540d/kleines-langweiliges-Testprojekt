#!/usr/bin/env node

/**
 * Version Update Script: Update version strings across all files
 *
 * This script updates version numbers and cache-busting parameters
 * in all relevant files to ensure browsers load the latest version.
 *
 * Usage: node update-version.js
 */

const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const VERSION = packageJson.version;
const BUILD_DATE = new Date().toISOString().split('T')[0];

console.log(`📦 Updating to version ${VERSION} (${BUILD_DATE})`);

// Files to update
const updates = [
    {
        file: 'index.html',
        replacements: [
            {
                search: /style\.css\?v=[0-9.]+/g,
                replace: `style.css?v=${VERSION}`
            },
            {
                search: /script\.js\?v=[0-9.]+/g,
                replace: `script.js?v=${VERSION}`
            },
            {
                search: /firebase-config\.js\?v=[0-9.]+/g,
                replace: `firebase-config.js?v=${VERSION}`
            },
            {
                search: /auth\.js\?v=[0-9.]+/g,
                replace: `auth.js?v=${VERSION}`
            }
        ]
    },
    {
        file: 'service-worker.js',
        replacements: [
            {
                search: /const CACHE_VERSION = '[0-9.]+';/,
                replace: `const CACHE_VERSION = '${VERSION}';`
            },
            {
                search: /const BUILD_DATE = '[0-9-]+';/,
                replace: `const BUILD_DATE = '${BUILD_DATE}';`
            }
        ]
    },
    {
        file: 'manifest.json',
        replacements: [
            {
                search: /"version": "[0-9.]+"/,
                replace: `"version": "${VERSION}"`
            }
        ]
    }
];

// Perform updates
let updatedCount = 0;

updates.forEach(({ file, replacements }) => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} not found, skipping...`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ search, replace }) => {
        if (content.match(search)) {
            content = content.replace(search, replace);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
        updatedCount++;
    } else {
        console.log(`⏭️  ${file} - no changes needed`);
    }
});

console.log(`\n🎉 Version update complete! Updated ${updatedCount} files.`);
console.log(`📌 Version: ${VERSION}`);
console.log(`📅 Build Date: ${BUILD_DATE}`);
console.log('\n💡 Next steps:');
console.log('   1. npm run build (to generate firebase-config.js)');
console.log('   2. git add .');
console.log('   3. git commit -m "chore: update version to ' + VERSION + '"');
console.log('   4. git push');
