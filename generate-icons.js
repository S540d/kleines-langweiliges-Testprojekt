// Node.js script to generate icons
// Run with: node generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function drawCheckmark(ctx, x, y, size) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = size * 0.15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.5);
    ctx.lineTo(x + size * 0.35, y + size * 0.85);
    ctx.lineTo(x + size, y);
    ctx.stroke();
}

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Clean black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Draw Eisenhower Matrix grid (4 quadrants)
    const padding = size * 0.15;
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = size * 0.02;
    ctx.lineCap = 'round';

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, padding);
    ctx.lineTo(centerX, size - padding);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(padding, centerY);
    ctx.lineTo(size - padding, centerY);
    ctx.stroke();

    // Add checkmarks in quadrants
    const checkSize = size * 0.08;
    const offsetX = size * 0.12;
    const offsetY = size * 0.12;

    drawCheckmark(ctx, padding + offsetX, padding + offsetY, checkSize);
    drawCheckmark(ctx, centerX + offsetX, padding + offsetY, checkSize);
    drawCheckmark(ctx, padding + offsetX, centerY + offsetY, checkSize);
    drawCheckmark(ctx, centerX + offsetX, centerY + offsetY, checkSize);

    return canvas;
}

// Generate all icons
sizes.forEach(size => {
    const canvas = generateIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(outputDir, `icon-${size}x${size}.png`);

    fs.writeFileSync(filename, buffer);
    console.log(`Generated: ${filename}`);
});

console.log('\nAll icons generated successfully!');
