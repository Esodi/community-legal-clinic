// scripts/prepare-tauri.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const outDir = path.join(rootDir, 'out');

  // Create out directory if it doesn't exist, otherwise clean it
  try {
    await fs.access(outDir);
    // Directory exists, clean it
    const files = await fs.readdir(outDir);
    for (const file of files) {
      await fs.rm(path.join(outDir, file), { recursive: true, force: true });
    }
    console.log('Cleaned existing out directory');
  } catch (err) {
    // Directory doesn't exist, create it
    await fs.mkdir(outDir, { recursive: true });
    console.log('Created out directory');
  }

  // Create a static HTML file for Tauri
  try {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Legal Clinic App</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #333;
    }
    .loading {
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #09f;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <h1>Community Legal Clinic App</h1>
    <p>Loading your application...</p>
    <p>Please make sure your server is running.</p>
  </div>
  <script>
    // Implement proper loading logic for production
    setTimeout(() => {
      window.location.href = "http://localhost:3000";
    }, 1000);
  </script>
</body>
</html>`;
    
    await fs.writeFile(path.join(outDir, 'index.html'), indexHtml);
    console.log('Created index.html');
  } catch (err) {
    console.error('Error creating index.html:', err);
  }

  console.log('Preparation complete!');
}

main().catch(console.error); 