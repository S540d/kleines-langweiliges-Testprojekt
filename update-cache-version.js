#!/usr/bin/env node

/**
 * Cache Version Updater - Automatic Cache Busting
 * 
 * This script automatically updates cache versions across the project
 * to ensure users always get the latest version without manual cache clearing.
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp for cache busting
const now = new Date();
const buildDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
const buildTime = now.getTime(); // Unix timestamp

console.log('🔄 Updating cache versions...');

// 1. Update service-worker.js
function updateServiceWorker() {
    const swPath = path.join(__dirname, 'service-worker.js');
    
    if (!fs.existsSync(swPath)) {
        console.log('❌ service-worker.js not found');
        return;
    }
    
    let content = fs.readFileSync(swPath, 'utf8');
    
    // Update BUILD_DATE
    content = content.replace(
        /const BUILD_DATE = '[^']*';/,
        `const BUILD_DATE = '${buildDate}';`
    );
    
    // Update cache busting comment
    content = content.replace(
        /\/\/ Cache busting - update on each version/,
        `// Cache busting - updated ${now.toISOString()}`
    );
    
    fs.writeFileSync(swPath, content);
    console.log('✅ service-worker.js updated');
}

// 2. Update index.html with cache-busting parameters
function updateIndexHtml() {
    const htmlPath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
        console.log('❌ index.html not found');
        return;
    }
    
    let content = fs.readFileSync(htmlPath, 'utf8');
    
    // Update all script and CSS references with cache busting
    content = content.replace(
        /src="([^"]+\.js)(\?v=[^"]*)?"/g,
        `src="$1?v=${buildTime}"`
    );
    
    content = content.replace(
        /href="([^"]+\.css)(\?v=[^"]*)?"/g,
        `href="$1?v=${buildTime}"`
    );
    
    fs.writeFileSync(htmlPath, content);
    console.log('✅ index.html cache-busting updated');
}

// 3. Update manifest.json version
function updateManifest() {
    const manifestPath = path.join(__dirname, 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        console.log('❌ manifest.json not found');
        return;
    }
    
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Read version from package.json
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        manifest.version = packageJson.version;
        manifest.build_date = buildDate;
        
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('✅ manifest.json updated');
    } catch (error) {
        console.log('❌ Error updating manifest.json:', error.message);
    }
}

// 4. Create version info file
function createVersionInfo() {
    const versionInfo = {
        version: require('./package.json').version,
        buildDate: buildDate,
        buildTime: buildTime,
        commit: process.env.GITHUB_SHA || 'local',
        timestamp: now.toISOString()
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
    );
    
    console.log('✅ version.json created');
}

// Run all updates
try {
    updateServiceWorker();
    updateIndexHtml();
    updateManifest();
    createVersionInfo();
    
    console.log('🎉 Cache version update complete!');
    console.log(`📅 Build Date: ${buildDate}`);
    console.log(`⏰ Build Time: ${buildTime}`);
    
} catch (error) {
    console.error('❌ Cache update failed:', error.message);
    process.exit(1);
}