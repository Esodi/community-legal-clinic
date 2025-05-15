import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

console.log('🔧 Preparing for Tauri build...');

// Paths
const outDir = path.join(root, 'out');
const indexHtmlPath = path.join(outDir, 'index.html');

// Create out directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Create a simple HTML file with client-side rendering setup
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Legal Clinic</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #0F0F12;
      color: white;
      text-align: center;
    }
    .container {
      max-width: 800px;
      padding: 20px;
    }
    .loading {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #D4A537;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Community Legal Clinic</h1>
    <p>Loading application...</p>
    <div class="loading"></div>
  </div>
  <script>
    // Redirect to login page once loaded
    window.addEventListener('load', function() {
      // Simulate auth for Tauri app
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    });
  </script>
</body>
</html>`;

// Write the file
fs.writeFileSync(indexHtmlPath, htmlContent);

// Create dashboard directory and page
const dashboardDir = path.join(outDir, 'dashboard');
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

const dashboardHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Community Legal Clinic</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #0F0F12;
      color: white;
    }
    .app {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 250px;
      background-color: #001233;
      padding: 20px;
    }
    .sidebar-header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
      color: #D4A537;
    }
    .main-content {
      flex: 1;
      padding: 20px;
    }
    .menu-item {
      padding: 10px;
      margin: 5px 0;
      border-radius: 4px;
      cursor: pointer;
    }
    .menu-item:hover {
      background-color: #002855;
    }
    .active {
      background-color: #D4A537;
      color: #001233;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .welcome {
      font-size: 24px;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 20px;
    }
    .card {
      background-color: #001233;
      border-radius: 8px;
      padding: 20px;
    }
    .card-title {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .card-content {
      color: #888;
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="sidebar">
      <div class="sidebar-header">Community Legal Clinic</div>
      <div class="menu-item active">Dashboard</div>
      <div class="menu-item">Clients</div>
      <div class="menu-item">Calendar</div>
      <div class="menu-item">Documents</div>
      <div class="menu-item">Settings</div>
    </div>
    <div class="main-content">
      <div class="header">
        <div class="welcome">Welcome, Admin</div>
        <button onclick="logout()">Logout</button>
      </div>
      <div class="cards">
        <div class="card">
          <div class="card-title">Recent Cases</div>
          <div class="card-content">
            <p>You have 3 active cases</p>
          </div>
        </div>
        <div class="card">
          <div class="card-title">Upcoming Appointments</div>
          <div class="card-content">
            <p>2 appointments this week</p>
          </div>
        </div>
        <div class="card">
          <div class="card-title">Documents</div>
          <div class="card-content">
            <p>5 documents pending review</p>
          </div>
        </div>
        <div class="card">
          <div class="card-title">Messages</div>
          <div class="card-content">
            <p>3 unread messages</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    function logout() {
      document.cookie = 'isAuthenticated=false; path=/; max-age=0';
      window.location.href = '/login';
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(dashboardDir, 'index.html'), dashboardHtmlContent);

// Create login directory and page
const loginDir = path.join(outDir, 'login');
if (!fs.existsSync(loginDir)) {
  fs.mkdirSync(loginDir, { recursive: true });
}

const loginHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Community Legal Clinic</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #0F0F12;
      color: white;
    }
    .login-container {
      background-color: #001845;
      border-radius: 8px;
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 10px;
      border-radius: 4px;
      background-color: #162542;
      border: 1px solid #333;
      color: white;
    }
    button {
      width: 100%;
      padding: 12px;
      background-color: #D4A537;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background-color: #C29432;
    }
    .error {
      color: #ff5555;
      margin-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="header">
      <h2>Sign in to your account</h2>
      <p style="color: #888;">Welcome back! Please enter your details.</p>
    </div>
    
    <form id="loginForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      
      <div id="error" class="error"></div>
      
      <button type="submit">Sign in</button>
    </form>
  </div>
  
  <script>
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'admin' && password === 'admin') {
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
        window.location.href = '/dashboard';
      } else {
        document.getElementById('error').textContent = 'Invalid username or password';
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(loginDir, 'index.html'), loginHtmlContent);

console.log('✅ Static files for Tauri build created successfully!');
console.log('📂 Output directory:', outDir); 