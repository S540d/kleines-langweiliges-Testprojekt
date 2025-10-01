#!/usr/bin/env python3
"""
Generate app icons for PWA
Run with: python3 generate-icons.py
"""

from PIL import Image, ImageDraw
import os

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
output_dir = 'icons'

# Create output directory
os.makedirs(output_dir, exist_ok=True)

def draw_checkmark(draw, x, y, size):
    """Draw a checkmark"""
    line_width = int(size * 0.15)

    points = [
        (x, y + size * 0.5),
        (x + size * 0.35, y + size * 0.85),
        (x + size, y)
    ]

    draw.line(points, fill='white', width=line_width, joint='curve')

def generate_icon(size):
    """Generate a single icon"""
    # Create image with black background
    img = Image.new('RGB', (size, size), color='black')
    draw = ImageDraw.Draw(img)

    # Draw grid
    padding = int(size * 0.15)
    center_x = size // 2
    center_y = size // 2
    line_width = max(1, int(size * 0.02))

    # Vertical line
    draw.line([(center_x, padding), (center_x, size - padding)],
              fill='white', width=line_width)

    # Horizontal line
    draw.line([(padding, center_y), (size - padding, center_y)],
              fill='white', width=line_width)

    # Add checkmarks in quadrants
    check_size = int(size * 0.08)
    offset_x = int(size * 0.12)
    offset_y = int(size * 0.12)

    # Top-left
    draw_checkmark(draw, padding + offset_x, padding + offset_y, check_size)
    # Top-right
    draw_checkmark(draw, center_x + offset_x, padding + offset_y, check_size)
    # Bottom-left
    draw_checkmark(draw, padding + offset_x, center_y + offset_y, check_size)
    # Bottom-right
    draw_checkmark(draw, center_x + offset_x, center_y + offset_y, check_size)

    return img

# Generate all icons
for size in sizes:
    img = generate_icon(size)
    filename = os.path.join(output_dir, f'icon-{size}x{size}.png')
    img.save(filename, 'PNG')
    print(f'Generated: {filename}')

print('\nAll icons generated successfully!')
