const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Source image path (relative to project root)
const sourceImage = path.join(__dirname, '../assets/logo.png');

// Define the sizes we need
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

async function generateFavicons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      console.error('Error: Logo file not found at:', sourceImage);
      console.log('Please ensure your logo is placed in the assets directory as "logo.png"');
      process.exit(1);
    }

    // Generate PNG favicons
    for (const { size, name } of sizes) {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name}`);
    }

    // Generate ICO file (includes both 16x16 and 32x32)
    const favicon = await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();
    
    await fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), favicon);
    console.log('Generated favicon.ico');

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 